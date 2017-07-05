"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SwaggerParser = require("swagger-parser");
var jsf = require("json-schema-faker");
var faker = require("faker");
var middleware_1 = require("./middleware");
var formatters_1 = require("./formatters");
var utils_1 = require("./utils");
jsf.extend('faker', function () { return faker; });
// if this is set, it will override all other middleware config values. true will enable all, false will disable all
var DEFAULT_CONFIG_FORMATTER = { default: true };
var DEFAULT_CONFIG_MIDDLEWARE = { default: true };
exports.CORE_MIDDLEWARE = [middleware_1.requireProps, middleware_1.fakerMatcher, middleware_1.fakerDate];
exports.CORE_FORMATTERS = [formatters_1.binary, formatters_1.byte, formatters_1.fullDate, formatters_1.password];
/**
 * Bundle the API,
 * add / remove middleware and formatters based on config.
 * apply middleware and formatters
 * dereference the Swagger / OpenAPI file / object
 * save the paresed file as an object property on the current instance of the SwaggerDataGenerator Class
 *
 * @param {string} [swaggerSchema]   - the path to the Swagger file
 * @param {object} [config]          - Optional config to turn on / off base formatters and middleware
 * @returns {Promise<SwaggerObject>} - A promise that results in saving the paresed swagger file and returning that SwaggerObject
 *
 * @memberOf SwaggerDataGenerator
 */
function build(swaggerSchema, config) {
    if (config === void 0) { config = {}; }
    var formatters = config.formatters, middleware = config.middleware;
    var configurationF = (formatters ? formatters : DEFAULT_CONFIG_FORMATTER);
    var configurationM = (middleware ? middleware : DEFAULT_CONFIG_MIDDLEWARE);
    // create a registered array of formatters based on the configuration
    var _formatters = utils_1.configure(exports.CORE_FORMATTERS, configurationF);
    // apply any registered formatters
    _formatters.forEach(function (_a) {
        var formatName = _a.formatName, callback = _a.callback;
        return jsf.format(formatName, callback);
    });
    return SwaggerParser.bundle(swaggerSchema)
        .then(function (api) {
        // create a registered array of middleware based on the configuration
        var _middleware = utils_1.configure(exports.CORE_MIDDLEWARE, configurationM);
        var modifiedApi = Object.assign({}, api);
        //apply any registered middleware
        _middleware.forEach(function (m) { return modifiedApi = m(modifiedApi); });
        return modifiedApi;
    })
        .then(function (api) { return SwaggerParser.dereference(api); })
        .catch(function (err) {
        throw new Error("Error has occured when trying to bundle and dereference the OpenAPI / Swagger object. \n Error: " + err);
    });
}
exports.build = build;
/**
 * Generate mock data for one JSON schema object
 *
 * @static
 * @param {object} schema - A valid JSON schema object
 * @returns {object}      - Mock data representing the passed JSON Schema object
 *
 * @memberOf SwaggerDataGenerator
 */
function generate(swaggerSchema) {
    var _a = swaggerSchema.definitions, definitions = _a === void 0 ? {} : _a;
    return Object
        .keys(definitions)
        .reduce(function (mockData, def) {
        mockData[def] = utils_1.generateData(definitions[def], jsf);
        return mockData;
    }, {});
}
exports.generate = generate;
/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
var SwaggerDataGen = (function () {
    function SwaggerDataGen() {
    }
    return SwaggerDataGen;
}());
SwaggerDataGen.middleware = exports.CORE_MIDDLEWARE;
SwaggerDataGen.formatters = exports.CORE_FORMATTERS;
SwaggerDataGen.build = build;
SwaggerDataGen.generate = generate;
exports.default = SwaggerDataGen;
//# sourceMappingURL=SwaggerDataGen.js.map