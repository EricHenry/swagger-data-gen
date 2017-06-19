import { Spec as Swagger } from 'swagger-schema-official';

export type SDGMiddleware = (a: Swagger) => Swagger;

export type FormatterDescription = {
  formatName: string;
  callback: Function;
};

export interface IConfigType {
  all: boolean;
}

export interface FormatterConfig extends IConfigType {
  binary: boolean;
  byte: boolean;
  fullDate: boolean;
  password: boolean;
  all: boolean;
}

export interface MiddlewareConfig extends IConfigType {
  fakerMatcher: boolean;
  fakerDate: boolean;
  requireProps: boolean;
  all: boolean;
}

export type DefaultConfig = {
  formatters: FormatterConfig;
  middleware: MiddlewareConfig;
};
