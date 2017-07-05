"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Take in a JSON schema and and generate mock data for it
 * @param schema {JSONSchema} - A valid json schema
 * @param jsf {Json-Schema-Faker} - the json schema faker module
 * @param options {} - TODO: allow for returning multiple mocks
 * @returns {object} - mock data
 */
function generateData(schema, jsf) {
    return jsf(schema);
}
exports.generateData = generateData;
//# sourceMappingURL=generateData.js.map