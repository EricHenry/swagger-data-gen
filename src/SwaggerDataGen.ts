import * as SwaggerParser from 'swagger-parser';
import * as jsf from 'json-schema-faker';
import * as faker from 'faker';
import * as formatters from './formatters';
import * as middleware from './middleware';
import { configureFormatters, configureMiddleWare, generateMock } from './utils';
import { Formatter, Middleware, BuildOptions } from './types';
import { Spec as Swagger } from 'swagger-schema-official';

jsf.extend('faker', () => faker);

  // if this is set, it will override all other middleware config values. true will enable all, false will disable all
const DEFAULT_CONFIG_FORMATTER = { default: true };
const DEFAULT_CONFIG_MIDDLEWARE = { default: true };

const CORE_MIDDLEWARE: Middleware[] = [middleware.requireProps, middleware.fakerMatcher, middleware.fakerDate];
const CORE_FORMATTERS: Formatter[] = [formatters.binary, formatters.byte, formatters.fullDate, formatters.password];

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
export function build(swaggerSchema: string | Swagger, config: BuildOptions = {}): Promise<Swagger> {
  const { formatters, middleware } = config;
  const configFormatters = (formatters ? formatters : DEFAULT_CONFIG_FORMATTER);
  const configMiddleware = (middleware ? middleware : DEFAULT_CONFIG_MIDDLEWARE);

  // apply any registered formatters
  const _formatters = configureFormatters(CORE_FORMATTERS, configFormatters);
  _formatters.forEach(({ formatName, callback }) => jsf.format(formatName, callback));

  return SwaggerParser.bundle(swaggerSchema)
    .then((api: Swagger) => {
      const _middleware = configureMiddleware(CORE_MIDDLEWARE, configMiddleware);

      let modifiedApi = Object.assign({}, api);
      _middleware.forEach(m => modifiedApi = m(modifiedApi));
      return modifiedApi;
    })
    .then(api => SwaggerParser.dereference(api))
    .then(api => api)
    .catch((err: Error) => {
      throw new Error(`Error has occured when trying to bundle and dereference the OpenAPI / Swagger object. \n Error: ${err}`);
    });
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
export function generate(swaggerSchema: Swagger): any {
  const { definitions = {} } = swaggerSchema;

  return Object
    .keys(definitions)
    .reduce((mockData, def) => {
      mockData[def] = generateMock(definitions[def], jsf);
      return mockData;
    }, {});
}

/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
export default class SwaggerDataGen {
  private static _middleware: Middleware[] = CORE_MIDDLEWARE;
  private static _formatters: Formatter[] = CORE_FORMATTERS;
  public static build = build;
  public static generate  = generate;
}
