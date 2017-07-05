import { Spec as Swagger } from 'swagger-schema-official';

// ----------------------------- Middleware -----------------------------------
export type Middleware = (a: Swagger) => Swagger;

// ----------------------------- Custom Middleware -----------------------------------
export declare const fakerDate: Middleware;
export declare const fakerMatcher: Middleware;
export declare const requireProps: Middleware;

// ----------------------------- Formatter -----------------------------------
export interface Formatter {
  formatName: string;
  callback: Function;
}

// ----------------------------- Custom Formatters -----------------------------------
export declare const binaryFormatter: Formatter;
export declare const byteFormatter: Formatter;
export declare const fullDateFormatter: Formatter;
export declare const passwordFormatter: Formatter;

// ----------------------------- Configuration -----------------------------------
export interface IConfigType<T> {
  // will include the default and any additional of type T
  include?: T[];
  // will exclude anything in this field regardless of what is in the include property
  exclude?: T[];
  // activates the default built in formatters / middleware
  default: boolean;
}

export interface FormatterConfig extends IConfigType<Formatter> {}
export interface MiddlewareConfig extends IConfigType<Middleware> {}

export interface BuildOptions {
  formatters?: FormatterConfig;
  middleware?: MiddlewareConfig;
}

// ----------------------------- Utilities -----------------------------------
export declare function configure<T>(core: T[], config: IConfigType<T>): T[];
export declare function generateData(schema: any, jsf: any): any;
export declare const levenshteinDistance: (source: string, target: string) => number;

// ----------------------------- SwaggerDataGen Lib -----------------------------------
export declare const CORE_MIDDLEWARE: Middleware[];
export declare const CORE_FORMATTERS: Formatter[];
export declare function build(swaggerSchema: string | Swagger, config?: BuildOptions): Promise<Swagger>;
export declare function generate(swaggerSchema: Swagger): any;
export declare class SwaggerDataGen {
  static middleware: Middleware[];
  static formatters: Formatter[];
  static build: typeof build;
  static generate: typeof generate;
}
