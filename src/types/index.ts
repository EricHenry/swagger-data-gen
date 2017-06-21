import { Spec as Swagger } from 'swagger-schema-official';

export type Middleware = (a: Swagger) => Swagger;

export type Formatter = {
  formatName: string;
  callback: Function;
};

export interface IConfigType<T> {
  include?: (T | string)[];
  exclude?: (T | string)[];
  all?: boolean;
}

export interface FormatterConfig extends IConfigType<Formatter> {
  binary?: boolean;
  byte?: boolean;
  fullDate?: boolean;
  password?: boolean;
}

export interface MiddlewareConfig extends IConfigType<Middleware> {
  fakerMatcher?: boolean;
  fakerDate?: boolean;
  requireProps?: boolean;
}

export type BuildOptions = {
  formatters?: FormatterConfig;
  middleware?: MiddlewareConfig;
};
