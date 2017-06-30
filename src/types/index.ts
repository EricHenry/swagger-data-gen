import { Spec as Swagger } from 'swagger-schema-official';

export type Middleware = (a: Swagger) => Swagger;

export type Formatter = {
  formatName: string;
  callback: Function;
};

export interface IConfigType<T> {
  // will include the default and any additional of type T
  include?: (T | string)[];
  // will exclude anything in this field regardless of what is in the include property
  exclude?: (T | string)[];
  // activates the default built in formatters / middleware
  default: boolean;
}

export interface FormatterConfig extends IConfigType<Formatter> {}
export interface MiddlewareConfig extends IConfigType<Middleware> {}

export type BuildOptions = {
  formatters?: FormatterConfig;
  middleware?: MiddlewareConfig;
};
