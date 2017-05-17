const SwaggerParser = require('swagger-parser');
const jsf = require('json-schema-faker');
const generators = require('./formatters');
const middleware = require('./middleware');
const { configure, generateMock } = require('./utils');

jsf.extend('faker', () => require('faker'));

const DEFAULT_RUN_CONFIG = {
  formatters: {
    binary: true,    // optional - true will apply the formatter
    byte: true,      // optional - true will apply the formatter
    fullDate: true,  // optional - true will apply the formatter
    password: true,  // optional - true will apply the formatter
    all: true        // optional - if this is set, it will override all other formatter config values. true will enable all, false will disable all
  },
  middleware: {
    fakerMatcher: true,  // optional - true will apply the middleware
    fakerDate: true,     // optional - true will apply the middleware
    requireProps: true,  // optional - true will apply the middleware
    all: true            // optional - if this is set, it will override all other middleware config values. true will enable all, false will disable all
  }
};

const CORE_MIDDLEWARE = [middleware.requireProps, middleware.fakerMatcher, middleware.fakerDate];
const CORE_FORMATTERS = [generators.binary, generators.byte, generators.fullDate, generators.password];

/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
class SwaggerDataGenerator {
  constructor(filePath) {
    if (typeof filePath !== 'string') {
      throw new Error('Please provide a file path to the swagger document.');
    }

    this._pathToFile = filePath;
    this._parsedFile = null;
    this._middleware = CORE_MIDDLEWARE;
    this._formatters = CORE_FORMATTERS;
  }

  get middleware() {
    return this._middleware;
  }

  get formatters() {
    return this._formatters;
  }

  /**
   * Add a middleware function to the list middleware that modify the api object
   *
   * @param {function} middleware - should accept the the api object and return an api object
   * @returns {function}          - the function should be
   *
   * @memberOf SwaggerDataGenerator
   */
  registerMiddleware(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('To register a middleware, please provide the function to add.');
    }

    this._middleware.push(middleware);
    return middleware;
  }

  /**
   * Removes the middleware function from the list of registered middleware
   *
   * @param {function} middleware - the function to remove from the middleware
   *
   * @memberOf SwaggerDataGenerator
   */
  deregisterMiddleWare(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('To deregister a middleware, please provide the middleware function to remove.');
    }

    const middlewareLocation = this._middleware.findIndex(middleware);
    this._middleware = this._middleware.splice(middlewareLocation, 1);
  }

  /**
   * Adds a custom formatter to the list of formatters, which will eventually
   *  be used to to set formatters in the JSON Schema Faker package
   *
   * @param {string} formatName - the format you want to add a custom generator for
   * @param {function} callback - the function that will be passed to the JSON Schema Faker formatter
   * @returns {object}          - an object describing the object that was just added, used to deregister the formatter at a later time
   *
   * @memberOf SwaggerDataGenerator
   */
  registerFomatter(formatName, callback) {
    if (typeof formatName !== 'string') {
      throw new Error('To register a formatter, please provide a format name as a string.')
    }
    if (typeof callback !== 'function') {
      throw new Error('To register a formatter, please provide a callback function to add');
    }

    const newFormatter = { formatName, callback };
    this._formatters.push(newFormatter);
    return newFormatter;
  }

  /**
   * Removes the formatter function from the list of registered formatters
   *
   * @param {object} formatter - the formatter object to remove from the formatters list
   *
   * @memberOf SwaggerDataGenerator
   */
  deregisterFormatter(formatter) {
    if (typeof middleware !== 'function') {
      throw new Error('To deregister a formatter, please provide the formatter object to remove.');
    }

    const formatterLocation = this._middleware.findIndex(formatter);
    this._formatters = this._formatters.splice(formatterLocation, 1);
  }

  /**
   * Bundle the API,
   * add / remove middleware and formatters based on config.
   *
   * @param {object} [config] -
   * @returns {Promise}       -
   *
   * @memberOf SwaggerDataGenerator
   */
  run(config = {}) {
    let configFormatters = (config.formatters ? config.formatters : DEFAULT_RUN_CONFIG.formatters);
    let configMiddleware = (config.middleware ? config.middleware : DEFAULT_RUN_CONFIG.middleware);

    // apply any registered formatters
    this._formatters = configure(this._formatters, configFormatters);
    this._formatters.forEach(({ formatName, callback }) => jsf.format(formatName, callback));

    return SwaggerParser.bundle(this._pathToFile)
      .then(api => {
        this._middleware = configure(this._middleware, configMiddleware);

        let modifiedApi = Object.assign({}, api);
        this._middleware.forEach(func => modifiedApi = func(modifiedApi));
        return modifiedApi;
      })
      .then(api => SwaggerParser.dereference(api))
      .then(api => this._parsedFile = api)
      .catch((err) => { throw new Error(`Error has occured when trying to bundle and dereference the OpenAPI / Swagger object. \n Error: ${err}`); });
  }

  /**
   *
   *
   * @param {any} options
   * @returns
   *
   * @memberOf SwaggerDataGenerator
   */
  generateMocks() {
    return Object
      .keys(this._parsedFile.definitions)
      .reduce((mockData, def) => {
        mockData[def] = SwaggerDataGenerator.generateMocks(this._parsedFile.definitions[def]);
        return mockData;
      }, {});
  }

  /**
   *
   *
   * @static
   * @param {any} schema
   * @param {any} options
   * @returns
   *
   * @memberOf SwaggerDataGenerator
   */
  static generateMocks(schema) {
    return generateMock(schema, jsf);
  }
}

module.exports = SwaggerDataGenerator;
