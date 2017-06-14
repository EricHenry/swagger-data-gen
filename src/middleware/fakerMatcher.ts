import { memoize } from 'lodash';
import * as faker from 'faker';
import { SwaggerObject } from '../types';

const INVALID_FAKER_PROPS = [
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
    .filter(k => !INVALID_FAKER_PROPS.includes(k))
    .reduce((res, k) => {
      const subKeys = Object.keys(faker[k]) || {};
      subKeys.forEach(sk => res[sk] = k);
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
const findClosestMatch = memoize((propName: string, fakerValues: any) => {
  const propCosts = [];

  // Map keys in fakerValues to an array of objects that
  // has the propName and associated distance cost
  for (const k in fakerValues) {
    if (fakerValues.hasOwnProperty(k)) {
      const cost = levenshteinDistance(k, propName);
      const propCost = { cost, prop: propName, match: k };

      // cost of 0 means an exact match
      // dont continue if we have an exact match
      if (cost === 0) {
        return propCost;
      }

      propCosts.push(propCost);
    }
  }

  propCosts.sort((a, b) => a.cost - b.cost);

  return propCosts[0];
});

/**
 * This is an implementation of the levenshtein distance algorithm
 *  it simply finds the cost distance (a number equating to the differnce in the strings)
 *  of two strings
 *
 * @param {string} source - string that you want to validate against
 * @param {string} target - string to try to match to source
 * @returns {number}      - The edit distance of the two input strings
 */
const levenshteinDistance = (source: string, target: string): number => {
  // if either param is an empty str
  // use the other str's length as the edit distance score
  if (!source.length) {
    return target.length;
  }
  if (!target.length) {
    return source.length;
  }

  // editDistance Matrix
  // matrix dimension should be
  // len(source) X len(target)
  const edMatrix = [];
  let m; // representation of rows
  let n; // representation of columns

  // intiallize each row of the matrix and
  // set the first coulumn of each row of the matrix
  // each cell should increment from 0 to len(source)
  for (m = 0; m <= source.length; m++) {
    edMatrix[m] = [m];
  }

  // initialize the rest of the first row,
  // each cells should increment from 0 to len(target)
  for (n = 1; n <= target.length; n++) {
    edMatrix[0][n] = n;
  }

  for (m = 1; m <= source.length; m++) {
    for (n = 1; n <= target.length; n++) {
      // if the charcters at the given point are the same,
      // set the current value of the matrix to the top left diagonal
      // of the current cell (as per the algo)
      // else get the minimum of deleteing, inserting, or swapping
      if (source.charAt(m) === target.charAt(n)) {
        edMatrix[m][n] = edMatrix[m - 1][n - 1];
      } else {
        edMatrix[m][n] = Math.min( // get the minimum value of one of the three
          edMatrix[m - 1][n] + 1,    // this location of the matrix represents an insertion
          edMatrix[m][n - 1] + 1,    // this location of the matrix represents an delete
          edMatrix[m - 1][n - 1] + 1   // this location of the matrix represents an swap
        );
      }
    }
  }

  // the distance cost will be the Matrix[len(m)][len(n)]
  return edMatrix[source.length][target.length];
};

// ------------------------------------------------------------------------
// Module
// ------------------------------------------------------------------------

const COST_CAP = 3;
const mappedFakerValues = getFakerValues();

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
const addFakerToDefinition = (definition: any) => {
  if (!Object.keys(definition.properties).length) {
    throw new Error('The JSON schema passed does not have any properties, cannot inject faker values');
  }

  // Now we will attempt to guess the closest faker match
  const propertiesCopy = Object.assign({}, definition.properties);
  const propsWithFaker = Object.keys(propertiesCopy)
    .map(k => findClosestMatch(k, mappedFakerValues))
    .filter(match => match.cost < COST_CAP )
    .map(({ prop, match }) => (
      {
        [prop]: {
          faker: `${mappedFakerValues[match]}.${match}`
        },
        prop
      }
    ))
    .reduce((res, faker) => {
      res[faker.prop] = Object.assign(
        {},
        res[faker.prop],
        propertiesCopy[faker.prop],
        faker[faker.prop]
      );
      return res;
    }, {});

  const mergedProps = Object.assign({}, propertiesCopy, propsWithFaker);
  return Object.assign({}, definition, { properties: mergedProps });
};

/**
 * This function will take in a OpenApi / Swagger object
 * and attempt to assign faker values to all of the definitions
 * @param {Object}   api    - an OpenAPI / Swagger object to be extended
 * @returns {Object}        - an identical definition with the addition of a faker property
 *
 */
export const fakerMatcher = (api: SwaggerObject): SwaggerObject => {
  if (!Object.keys(api.definitions)) {
    throw new Error('To add faker values to the OpenAPI / Swagger file, it must have defnitions to parse');
  }

  const { definitions } = api;

  const definitionsWithFakerValues = Object
    .keys(definitions)
    .reduce((res, k) => {
      res[k] = Object.assign({}, definitions[k], addFakerToDefinition(definitions[k]));
      return res;
    }, {});

  const newAPI = Object.assign({}, api, { definitions: definitionsWithFakerValues });
  return newAPI;
};