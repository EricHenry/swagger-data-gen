"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var faker = require("faker");
var _1 = require("../utils/");
var INVALID_FAKER_PROPS = [
    'definitions',
    'fake',
    'locale',
    'locales',
    'localeFallback',
    'lorem',
    'image'
];
// ------------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------------
/**
 * This will go through the faker lib and attempt to get all of the valid faker values
 * We can then use these values to match the definiton as closely as possible
 * @returns {object} - all of the possible faker values
 */
function getFakerValues() {
    // These keys will let us pull out all sub definitions
    return Object.keys(faker)
        .filter(function (k) { return !INVALID_FAKER_PROPS.includes(k); })
        .reduce(function (res, k) {
        var subKeys = Object.keys(faker[k]) || {};
        subKeys.forEach(function (sk) { return res[sk] = k; });
        return res;
    }, {});
}
/**
 * Go through all of the faker values and
 *
 * @param {string} propName
 * @param {object} fakerValues
 * @returns {object} - {
 *                       cost: number;   // The distance cost between the prop and the match
 *                       prop: string;   // the name of the propertie to search for
 *                       match: string;  // the faker match of the prop search term
 *                     }
 */
var findClosestMatch = lodash_1.memoize(function (propName, fakerValues) {
    var propCosts = [];
    // Map keys in fakerValues to an array of objects that
    // has the propName and associated distance cost
    for (var k in fakerValues) {
        if (fakerValues.hasOwnProperty(k)) {
            var cost = _1.levenshteinDistance(k, propName);
            var propCost = { cost: cost, prop: propName, match: k };
            // cost of 0 means an exact match
            // dont continue if we have an exact match
            if (cost === 0) {
                return propCost;
            }
            propCosts.push(propCost);
        }
    }
    propCosts.sort(function (a, b) { return a.cost - b.cost; });
    return propCosts[0];
});
// ------------------------------------------------------------------------
// Module
// ------------------------------------------------------------------------
var COST_CAP = 3;
var mappedFakerValues = getFakerValues();
/**
 * This function will take in a valid JSON Schema
 * and attempt to assign a valid faker property to it
 *
 * @param {Object}   definition  - the JSON Schema of the object to be extended
 * @returns {Object}             - an identical definition with the addition of a faker property
 *
 * @example
 *
 */
var addFakerToDefinition = function (definition) {
    if (!Object.keys(definition.properties).length) {
        throw new Error('The JSON schema passed does not have any properties, cannot inject faker values');
    }
    // Now we will attempt to guess the closest faker match
    var propertiesCopy = Object.assign({}, definition.properties);
    var propsWithFaker = Object.keys(propertiesCopy)
        .map(function (k) { return findClosestMatch(k, mappedFakerValues); })
        .filter(function (match) { return match.cost < COST_CAP; })
        .map(function (_a) {
        var prop = _a.prop, match = _a.match;
        return (_b = {},
            _b[prop] = {
                faker: mappedFakerValues[match] + "." + match
            },
            _b.prop = prop,
            _b);
        var _b;
    })
        .reduce(function (res, faker) {
        res[faker.prop] = Object.assign({}, res[faker.prop], propertiesCopy[faker.prop], faker[faker.prop]);
        return res;
    }, {});
    var mergedProps = Object.assign({}, propertiesCopy, propsWithFaker);
    return Object.assign({}, definition, { properties: mergedProps });
};
/**
 * This function will take in a OpenApi / Swagger object
 * and attempt to assign faker values to all of the definitions
 * @param {Object}   api    - an OpenAPI / Swagger object to be extended
 * @returns {Object}        - an identical definition with the addition of a faker property
 *
 */
exports.fakerMatcher = function (api) {
    var definitions = api.definitions;
    if (!definitions || !Object.keys(definitions).length) {
        throw new Error('To add faker values to the OpenAPI / Swagger file, it must have defnitions to parse');
    }
    var definitionsWithFakerValues = Object
        .keys(definitions)
        .reduce(function (res, k) {
        res[k] = Object.assign({}, definitions[k], addFakerToDefinition(definitions[k]));
        return res;
    }, {});
    var newAPI = Object.assign({}, api, { definitions: definitionsWithFakerValues });
    return newAPI;
};
//# sourceMappingURL=fakerMatcher.js.map