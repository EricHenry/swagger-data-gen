import { SwaggerObject, FormatterDescription, SDGMiddleware, DefaultConfig } from './types';
/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
export declare class SwaggerDataGenerator {
    private _pathToFile;
    private _parsedFile;
    private _middleware;
    private _formatters;
    constructor(filePath: string | Object);
    readonly middleware: SDGMiddleware[];
    readonly formatters: FormatterDescription[];
    /**
     * Add a middleware function to the list middleware that modify the api object
     *
     * @param {function} middleware - should accept the the api object and return an api object
     * @returns {function}          - the function should be
     *
     * @memberOf SwaggerDataGenerator
     */
    registerMiddleware(middleware: SDGMiddleware): SDGMiddleware;
    /**
     * Removes the middleware function from the list of registered middleware
     *
     * @param {function} middleware - the function to remove from the middleware
     *
     * @memberOf SwaggerDataGenerator
     */
    deregisterMiddleWare(middleware: SDGMiddleware): void;
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
    registerFomatter(formatName: string, callback: Function): {
        formatName: string;
        callback: Function;
    };
    /**
     * Removes the formatter function from the list of registered formatters
     *
     * @param {object} formatter - the formatter object to remove from the formatters list
     *
     * @memberOf SwaggerDataGenerator
     */
    deregisterFormatter(formatter: FormatterDescription): void;
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
    run(config?: DefaultConfig): Promise<SwaggerObject>;
    /**
     * Generate mock data for all definitions in the Swagger / OpenAPI object
     *
     * @returns {object} - an object containing objects of mock data that represent all of the Swagger / OpenAPI definitions
     *
     * @memberOf SwaggerDataGenerator
     */
    generateMockData(): {};
    /**
     * Generate mock data for one JSON schema object
     *
     * @static
     * @param {object} schema - A valid JSON schema object
     * @returns {object}      - Mock data representing the passed JSON Schema object
     *
     * @memberOf SwaggerDataGenerator
     */
    static generateMockData(schema: any): any;
}
