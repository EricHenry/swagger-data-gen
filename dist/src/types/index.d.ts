import { Spec as Swagger } from 'swagger-schema-official';
export declare type Middleware = (a: Swagger) => Swagger;
export declare const fakerDate: Middleware;
export declare const fakerMatcher: Middleware;
export declare const requireProps: Middleware;
export interface Formatter {
    formatName: string;
    callback: Function;
}
export declare const binaryFormatter: Formatter;
export declare const byteFormatter: Formatter;
export declare const fullDateFormatter: Formatter;
export declare const passwordFormatter: Formatter;
export interface IConfigType<T> {
    include?: T[];
    exclude?: T[];
    default: boolean;
}
export interface FormatterConfig extends IConfigType<Formatter> {
}
export interface MiddlewareConfig extends IConfigType<Middleware> {
}
export interface BuildOptions {
    formatters?: FormatterConfig;
    middleware?: MiddlewareConfig;
}
export declare function configure<T>(core: T[], config: IConfigType<T>): T[];
export declare function generateData(schema: any, jsf: any): any;
export declare const levenshteinDistance: (source: string, target: string) => number;
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
