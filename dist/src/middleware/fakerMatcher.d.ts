import { Spec as Swagger } from 'swagger-schema-official';
/**
 * This function will take in a OpenApi / Swagger object
 * and attempt to assign faker values to all of the definitions
 * @param {Object}   api    - an OpenAPI / Swagger object to be extended
 * @returns {Object}        - an identical definition with the addition of a faker property
 *
 */
export declare const fakerMatcher: (api: Swagger) => Swagger;
