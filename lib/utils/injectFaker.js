const { memoize } = require('lodash');
const faker = require('faker');
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
 * @returns {{}} - all of the possible faker values
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
 *
 */
const findClosestMatch = memoize((propName, fakerValues) => {
  const propCosts = [];  // if the lowest cost is greater th

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
const levenshteinDistance = (source, target) => {
  // if either param is an empty str
  // use the other str's length as the edit distance score
  if (!source.length) return target.length;
  if (!target.length) return source.length;

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

const COST_CAP = 7;
const mappedFakerValues = getFakerValues();

/**
 * This function will take in all definitions in the swagger.json file
 * and attempt to assign a valid faker property to it
 * @param {Object}   definition  - the JSON Schema of the object to be extended
 * @param {Function} [customMap] - a custom mapping defined by the user
 * @returns {Object}             - an identical definition with the addition of a faker property
 *
 * @example
 *
 */
// const override = (definition, customMap) => {
module.exports = (definition, customMap) => {
  // First try to map with the custom map
  if (customMap) {
    try {
      const newDef = customMap(definition);
      // If the customMap returned nothing, throw an error
      if (!newDef) {
        throw new Error('The custom map function cannot return undefined');
      }
    } catch (error) {
      throw new Error(`The custom mapping function provided threw an error: ${error}
      Please check that this function is valid`);
    }
  }
  if (!Object.keys(definition.properties).length) {
    console.log(definition);
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

  return Object.assign({}, definition, { properties: propertiesCopy }, { properties: propsWithFaker });
};
