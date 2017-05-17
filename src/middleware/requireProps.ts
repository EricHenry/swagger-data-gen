import { SwaggerObject } from '../types';
/**
 * Takes in a Swagger / OpenAPI object and attempts to modify the defintions
 *
 * @param {object} api  - an Swagger / OpenAPI object to parse
 * @returns {object}    - a new Swagger / OpenAPI object with an updated definitions property;
 */
export default (api: SwaggerObject): SwaggerObject => {
  if (!Object.keys(api.definitions)) {
    throw new Error('To add required properties to the OpenAPI / Swagger file, it must have defnitions to parse');
  }

  const { definitions } = api;

  // Each definintion is update to require all of its properties.
  // each definition should require all of its properties, so that
  const newDef = Object.keys(definitions)
    .filter(def => !!definitions[def].properties)
    .reduce((res, def) => {
      const required = Object.keys(definitions[def].properties);
      res[def] = Object.assign({}, definitions[def], { required });
      return res;
    }, {});

  // create a brand new API object
  const newAPI = Object.assign({}, api, { definitions: newDef });
  return newAPI;
};
