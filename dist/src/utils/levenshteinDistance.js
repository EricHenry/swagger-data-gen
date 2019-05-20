"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is an implementation of the levenshtein distance algorithm
 *  it simply finds the cost distance (a number equating to the differnce in the strings)
 *  of two strings
 *
 * @param {string} source - string that you want to validate against
 * @param {string} target - string to try to match to source
 * @returns {number}      - The edit distance of the two input strings
 */
exports.levenshteinDistance = function (source, target) {
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
    var edMatrix = [];
    var m; // representation of rows
    var n; // representation of columns
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
            }
            else {
                edMatrix[m][n] = Math.min(// get the minimum value of one of the three
                edMatrix[m - 1][n] + 1, // this location of the matrix represents an insertion
                edMatrix[m][n - 1] + 1, // this location of the matrix represents an delete
                edMatrix[m - 1][n - 1] + 1 // this location of the matrix represents an swap
                );
            }
        }
    }
    // the distance cost will be the Matrix[len(m)][len(n)]
    return edMatrix[source.length][target.length];
};
//# sourceMappingURL=levenshteinDistance.js.map