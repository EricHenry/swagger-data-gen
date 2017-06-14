export declare type SwaggerObject = {
    definitions: Object;
    info: Object;
    paths: Object;
};
export declare type SDGMiddleware = (a: SwaggerObject) => SwaggerObject;
export declare type FormatterDescription = {
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
export declare type DefaultConfig = {
    formatters: FormatterConfig;
    middleware: MiddlewareConfig;
};
