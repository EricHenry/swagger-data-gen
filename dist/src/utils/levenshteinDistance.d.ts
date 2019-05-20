/**
 * This is an implementation of the levenshtein distance algorithm
 *  it simply finds the cost distance (a number equating to the differnce in the strings)
 *  of two strings
 *
 * @param {string} source - string that you want to validate against
 * @param {string} target - string to try to match to source
 * @returns {number}      - The edit distance of the two input strings
 */
export declare const levenshteinDistance: (source: string, target: string) => number;
