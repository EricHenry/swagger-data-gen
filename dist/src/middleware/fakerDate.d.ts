import { Spec as Swagger } from 'swagger-schema-official';
/**
 * Takes in a Swagger / OpenAPI object and attempts to modify the defintions.
 *  Each definition object that has a property(ies) with the word 'date' in it should
 *  be injected with a faker value of 'date.recent' value into those properties.
 *
 * This will provide mock data with believable date data.
 *
 * @param {SwaggerObject} api  - an Swagger / OpenAPI object to parse
 * @returns {SwaggerObject}    - a new Swagger / OpenAPI object with an updated definitions property.
 */
export declare const fakerDate: (api: Swagger) => Swagger;
