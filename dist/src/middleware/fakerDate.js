"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Given a definition object (valid JSON Schema) add a faker property of 'date.recent'
 *  for any property that
 *
 * @param {object} definition  - the definitions object of a swagger doc
 * @returns {Object}          - a new definitions object
 */
function injectDateFaker(definition) {
    return Object
        .keys(definition.properties)
        .filter(function (prop) { return prop.includes('date'); })
        .reduce(function (props, prop) {
        props[prop] = Object.assign({}, definition.properties[prop], { faker: 'date.recent' });
        return props;
    }, {});
}
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
exports.fakerDate = function (api) {
    var definitions = api.definitions;
    if (!definitions || !Object.keys(definitions).length) {
        throw new Error('To add faker values to the OpenAPI / Swagger file, it must have defnitions to parse');
    }
    var newDefs = Object
        .keys(definitions)
        .filter(function (def) { return !!definitions[def].properties; })
        .reduce(function (res, def) {
        var mergeProps = Object.assign({}, definitions[def].properties, injectDateFaker(definitions[def]));
        res[def] = Object.assign({}, definitions[def], { properties: mergeProps });
        return res;
    }, {});
    var newAPI = Object.assign({}, api, { definitions: newDefs });
    return newAPI;
};
//# sourceMappingURL=fakerDate.js.map