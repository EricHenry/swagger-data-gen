/**
 * Take in a JSON schema and and generate mock data for it
 * @param schema {JSONSchema} - A valid json schema
 * @param options {} - TODO: allow for returning multiple mocks
 * @returns {object} - mock data
 */
function generateMock(schema, jsf) {
  return jsf(schema);
}

module.exports = generateMock;
