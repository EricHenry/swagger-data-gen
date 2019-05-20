"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Takes in a Swagger / OpenAPI object and attempts to modify the defintions
 *
 * @param {object} api  - an Swagger / OpenAPI object to parse
 * @returns {object}    - a new Swagger / OpenAPI object with an updated definitions property;
 */
exports.requireProps = function (api) {
    var definitions = api.definitions;
    if (!definitions || !Object.keys(definitions).length) {
        throw new Error('To add required properties to the OpenAPI / Swagger file, it must have defnitions to parse');
    }
    // Each definintion is update to require all of its properties.
    // each definition should require all of its properties, so that
    var newDef = Object.keys(definitions)
        .filter(function (def) { return !!definitions[def].properties; })
        .reduce(function (res, def) {
        var required = Object.keys(definitions[def].properties);
        res[def] = Object.assign({}, definitions[def], { required: required });
        return res;
    }, {});
    // create a brand new API object
    var newAPI = Object.assign({}, api, { definitions: newDef });
    return newAPI;
};
//# sourceMappingURL=requireProps.js.map