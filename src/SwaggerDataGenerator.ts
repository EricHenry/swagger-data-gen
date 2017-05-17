import SwaggerParser from 'swagger-parser';
import jsf from 'json-schema-faker';
import * as faker from 'faker';
import formatters from './formatters';
import middleware from './middleware';
import { configure, generateMock } from './utils';
import { SwaggerObject, FormatterDescription, SDGMiddleware, DefaultConfig } from './types';

jsf.extend('faker', () => faker);

const DEFAULT_RUN_CONFIG: DefaultConfig = {
  // if this is set, it will override all other middleware config values. true will enable all, false will disable all
  formatters: {
    binary: true,
    byte: true,
    fullDate: true,
    password: true,
    all: true
  },
  middleware: {
    fakerMatcher: true,
    fakerDate: true,
    requireProps: true,
    all: true
  }
};

const CORE_MIDDLEWARE: SDGMiddleware[] = [middleware.requireProps, middleware.fakerMatcher, middleware.fakerDate];
const CORE_FORMATTERS: FormatterDescription[] = [formatters.binary, formatters.byte, formatters.fullDate, formatters.password];

/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
class SwaggerDataGenerator {
  private _pathToFile: string;
  private _parsedFile: SwaggerObject;
  private _middleware: SDGMiddleware[];
  private _formatters: FormatterDescription[];

  constructor(filePath: string | Object) {
    if (typeof filePath !== 'string') {
      throw new Error('Please provide a file path to the swagger document.');
    }

    this._pathToFile = filePath;
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
  registerMiddleware(middleware: SDGMiddleware) {
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
  deregisterMiddleWare(middleware: SDGMiddleware) {
    if (typeof middleware !== 'function') {
      throw new Error('To deregister a middleware, please provide the middleware function to remove.');
    }

    const middlewareLocation = this._middleware.findIndex(m => m === middleware);
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
  registerFomatter(formatName: string, callback: Function) {
    if (typeof formatName !== 'string') {
      throw new Error('To register a formatter, please provide a format name as a string.');
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
  deregisterFormatter(formatter: FormatterDescription) {
    if (typeof middleware !== 'function') {
      throw new Error('To deregister a formatter, please provide the formatter object to remove.');
    }

    const formatterLocation = this._formatters.findIndex(f => f === formatter);
    this._formatters = this._formatters.splice(formatterLocation, 1);
  }

  /**
   * Bundle the API,
   * add / remove middleware and formatters based on config.
   * apply middleware and formatters
   * dereference the Swagger / OpenAPI file / object
   * save the paresed file as an object property on the current instance of the SwaggerDataGenerator Class
   *
   * @param {object} [config]          - Optional config to turn on / off base formatters and middleware
   * @returns {Promise<SwaggerObject>} - A promise that results in saving the paresed swagger file and returning that SwaggerObject
   *
   * @memberOf SwaggerDataGenerator
   */
  run(config: any) {
    const configFormatters = (config.formatters ? config.formatters : DEFAULT_RUN_CONFIG.formatters);
    const configMiddleware = (config.middleware ? config.middleware : DEFAULT_RUN_CONFIG.middleware);

    // apply any registered formatters
    this._formatters = configure(this._formatters, configFormatters);
    this._formatters.forEach(({ formatName, callback }) => jsf.format(formatName, callback));

    return SwaggerParser.bundle(this._pathToFile)
      .then((api: SwaggerObject) => {
        this._middleware = configure(this._middleware, configMiddleware);

        let modifiedApi = Object.assign({}, api);
        this._middleware.forEach(m => modifiedApi = m(modifiedApi));
        return modifiedApi;
      })
      .then((api: SwaggerObject) => SwaggerParser.dereference(api))
      .then((api: SwaggerObject) => {
        this._parsedFile = api;
        return api;
      })
      .catch((err: Error) => {
        throw new Error(`Error has occured when trying to bundle and dereference the OpenAPI / Swagger object. \n Error: ${err}`);
      });
  }

  /**
   * Generate mock data for all definitions in the Swagger / OpenAPI object
   *
   * @returns {object} - an object containing objects of mock data that represent all of the Swagger / OpenAPI definitions
   *
   * @memberOf SwaggerDataGenerator
   */
  generateMockData() {
    return Object
      .keys(this._parsedFile.definitions)
      .reduce((mockData, def) => {
        mockData[def] = SwaggerDataGenerator.generateMockData(this._parsedFile.definitions[def]);
        return mockData;
      }, {});
  }

  /**
   * Generate mock data for one JSON schema object
   *
   * @static
   * @param {object} schema - A valid JSON schema object
   * @returns {object}      - Mock data representing the passed JSON Schema object
   *
   * @memberOf SwaggerDataGenerator
   */
  static generateMockData(schema: any) {
    return generateMock(jsf, schema);
  }
}

module.exports = SwaggerDataGenerator;
