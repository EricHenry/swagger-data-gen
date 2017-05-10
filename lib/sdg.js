const SwaggerParser = require('swagger-parser');
const jsf = require('./jsfConfig.js')
const { requireAllProperties } = require('./utils/helpers.js');
const injectFaker = require('./utils/injectFaker.js');

function SwaggerDataGenerator(filePath) {
  this._pathToFile = filePath || '';
  this._parsedFile = {};
}

SwaggerDataGenerator.prototype.build = build;
SwaggerDataGenerator.prototype.generateMock = generateMock;

/**
 * Takes in a swagger file or use the one registered on the class to build a parsed file
 */
function build() {
  return SwaggerParser.bundle(this._pathToFile)
    .then(api => this._parsedFile = api)
    .then(() => 'successfully built')
    .catch(console.log);
}

/**
 * Take in a JSON schema and and generate mock data for it
 * @param schema {JSONSchema} - A valid json schema
 * @param options {} - TODO: allow for returning multiple mocks
 * @returns {object} - mock data
 */
function generateMock(options) {
  const definitions = requireAllProperties(this._parsedFile.definitions);
  const mockData = {};

  const test = Object.keys(definitions);
    test.forEach(k => {
      definitions[k] = injectFaker(definitions[k]);
    })

    test.forEach(k => {
      try {
        mockData[k] = jsf(definitions[k])
      } catch (err) {
        console.log(err);
      }
    })

  return mockData;
}

function applyMiddleware(whatToModify, middleware) {
  if (!this._parsedFile) {
    throw new Error('File has not been parsed, parse a fike ')
  }
  middleware(this._parsedFile[whatToModify]);
}

module.exports = SwaggerDataGenerator
