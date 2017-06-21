import * as SwaggerParser from 'swagger-parser';
import * as jsf from 'json-schema-faker';
import * as faker from 'faker';
import * as formatters from './formatters';
import * as middleware from './middleware';
import { configure, generateMock } from './utils';
import { Formatter, Middleware, BuildOptions } from './types';
import { Spec as Swagger } from 'swagger-schema-official';

jsf.extend('faker', () => faker);

const DEFAULT_RUN_CONFIG: BuildOptions = {
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

const CORE_MIDDLEWARE: Middleware[] = [middleware.requireProps, middleware.fakerMatcher, middleware.fakerDate];
const CORE_FORMATTERS: Formatter[] = [formatters.binary, formatters.byte, formatters.fullDate, formatters.password];

/**
 * Main hub in creating mock data from a OpenAPI / Swagger file
 *
 * @class SwaggerDataGenerator
 */
export class SwaggerDataGen {
  private static _middleware: Middleware[] = CORE_MIDDLEWARE;
  private static _formatters: Formatter[] = CORE_FORMATTERS;

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
  public static build(swaggerSchema: string | Swagger, config: BuildOptions = {}): Promise<Swagger> {
    const configFormatters = (config.formatters ? config.formatters : DEFAULT_RUN_CONFIG.formatters);
    const configMiddleware = (config.middleware ? config.middleware : DEFAULT_RUN_CONFIG.middleware);
    const { formatters } = config;

    // apply any registered formatters
    SwaggerDataGen._formatters = configure(SwaggerDataGen._formatters, configFormatters, CORE_FORMATTERS);
    SwaggerDataGen._formatters.forEach(({ formatName, callback }) => jsf.format(formatName, callback));

    return SwaggerParser.bundle(swaggerSchema)
      .then((api: Swagger) => {
        this._middleware = configure(this._middleware, configMiddleware, CORE_MIDDLEWARE);

        let modifiedApi = Object.assign({}, api);
        this._middleware.forEach(m => modifiedApi = m(modifiedApi));
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
  static generate(swaggerSchema: Swagger): any {
    const { definitions = {} } = swaggerSchema;

    return Object
      .keys(definitions)
      .reduce((mockData, def) => {
        mockData[def] = generateMock(definitions[def], jsf);
        return mockData;
      }, {});
  }
}
