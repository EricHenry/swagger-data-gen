"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwaggerParser = require("swagger-parser");
var jsf = require("json-schema-faker");
var faker = require("faker");
var formatters_1 = require("./formatters");
var middleware_1 = require("./middleware");
var utils_1 = require("./utils");
jsf.extend('faker', function () { return faker; });
var DEFAULT_RUN_CONFIG = {
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
var CORE_MIDDLEWARE = [middleware_1.default.requireProps, middleware_1.default.fakerMatcher, middleware_1.default.fakerDate];
var CORE_FORMATTERS = [formatters_1.default.binary, formatters_1.default.byte, formatters_1.default.fullDate, formatters_1.default.password];
/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
var SwaggerDataGenerator = (function () {
    function SwaggerDataGenerator(filePath) {
        if (typeof filePath !== 'string') {
            throw new Error('Please provide a file path to the swagger document.');
        }
        this._pathToFile = filePath;
        this._middleware = CORE_MIDDLEWARE;
        this._formatters = CORE_FORMATTERS;
    }
    Object.defineProperty(SwaggerDataGenerator.prototype, "middleware", {
        get: function () {
            return this._middleware;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SwaggerDataGenerator.prototype, "formatters", {
        get: function () {
            return this._formatters;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a middleware function to the list middleware that modify the api object
     *
     * @param {function} middleware - should accept the the api object and return an api object
     * @returns {function}          - the function should be
     *
     * @memberOf SwaggerDataGenerator
     */
    SwaggerDataGenerator.prototype.registerMiddleware = function (middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('To register a middleware, please provide the function to add.');
        }
        this._middleware.push(middleware);
        return middleware;
    };
    /**
     * Removes the middleware function from the list of registered middleware
     *
     * @param {function} middleware - the function to remove from the middleware
     *
     * @memberOf SwaggerDataGenerator
     */
    SwaggerDataGenerator.prototype.deregisterMiddleWare = function (middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('To deregister a middleware, please provide the middleware function to remove.');
        }
        var middlewareLocation = this._middleware.findIndex(function (m) { return m === middleware; });
        this._middleware = this._middleware.splice(middlewareLocation, 1);
    };
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
    SwaggerDataGenerator.prototype.registerFomatter = function (formatName, callback) {
        if (typeof formatName !== 'string') {
            throw new Error('To register a formatter, please provide a format name as a string.');
        }
        if (typeof callback !== 'function') {
            throw new Error('To register a formatter, please provide a callback function to add');
        }
        var newFormatter = { formatName: formatName, callback: callback };
        this._formatters.push(newFormatter);
        return newFormatter;
    };
    /**
     * Removes the formatter function from the list of registered formatters
     *
     * @param {object} formatter - the formatter object to remove from the formatters list
     *
     * @memberOf SwaggerDataGenerator
     */
    SwaggerDataGenerator.prototype.deregisterFormatter = function (formatter) {
        if (typeof middleware_1.default !== 'function') {
            throw new Error('To deregister a formatter, please provide the formatter object to remove.');
        }
        var formatterLocation = this._formatters.findIndex(function (f) { return f === formatter; });
        this._formatters = this._formatters.splice(formatterLocation, 1);
    };
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
    SwaggerDataGenerator.prototype.run = function (config) {
        var _this = this;
        if (config === void 0) { config = DEFAULT_RUN_CONFIG; }
        var configFormatters = (config.formatters ? config.formatters : DEFAULT_RUN_CONFIG.formatters);
        var configMiddleware = (config.middleware ? config.middleware : DEFAULT_RUN_CONFIG.middleware);
        // apply any registered formatters
        this._formatters = utils_1.configure(this._formatters, configFormatters, CORE_FORMATTERS);
        this._formatters.forEach(function (_a) {
            var formatName = _a.formatName, callback = _a.callback;
            return jsf.format(formatName, callback);
        });
        return SwaggerParser.bundle(this._pathToFile)
            .then(function (api) {
            _this._middleware = utils_1.configure(_this._middleware, configMiddleware, CORE_MIDDLEWARE);
            var modifiedApi = Object.assign({}, api);
            _this._middleware.forEach(function (m) { return modifiedApi = m(modifiedApi); });
            return modifiedApi;
        })
            .then(function (api) { return SwaggerParser.dereference(api); })
            .then(function (api) {
            _this._parsedFile = api;
            return api;
        })
            .catch(function (err) {
            throw new Error("Error has occured when trying to bundle and dereference the OpenAPI / Swagger object. \n Error: " + err);
        });
    };
    /**
     * Generate mock data for all definitions in the Swagger / OpenAPI object
     *
     * @returns {object} - an object containing objects of mock data that represent all of the Swagger / OpenAPI definitions
     *
     * @memberOf SwaggerDataGenerator
     */
    SwaggerDataGenerator.prototype.generateMockData = function () {
        var _this = this;
        return Object
            .keys(this._parsedFile.definitions)
            .reduce(function (mockData, def) {
            mockData[def] = SwaggerDataGenerator.generateMockData(_this._parsedFile.definitions[def]);
            return mockData;
        }, {});
    };
    /**
     * Generate mock data for one JSON schema object
     *
     * @static
     * @param {object} schema - A valid JSON schema object
     * @returns {object}      - Mock data representing the passed JSON Schema object
     *
     * @memberOf SwaggerDataGenerator
     */
    SwaggerDataGenerator.generateMockData = function (schema) {
        return utils_1.generateMock(schema, jsf);
    };
    return SwaggerDataGenerator;
}());
exports.SwaggerDataGenerator = SwaggerDataGenerator;
//# sourceMappingURL=SwaggerDataGenerator.js.map