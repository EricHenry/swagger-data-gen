import { Formatter, Middleware, BuildOptions } from './types';
import { Spec as Swagger } from 'swagger-schema-official';
export declare const CORE_MIDDLEWARE: Middleware[];
export declare const CORE_FORMATTERS: Formatter[];
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
export declare function build(swaggerSchema: string | Swagger, config?: BuildOptions): Promise<Swagger>;
/**
 * Generate mock data for one JSON schema object
 *
 * @static
 * @param {object} schema - A valid JSON schema object
 * @returns {object}      - Mock data representing the passed JSON Schema object
 *
 * @memberOf SwaggerDataGenerator
 */
export declare function generate(swaggerSchema: Swagger): any;
/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
export default class SwaggerDataGen {
    static middleware: Middleware[];
    static formatters: Formatter[];
    static build: typeof build;
    static generate: typeof generate;
}
