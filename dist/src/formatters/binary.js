"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 * binary - creates a random binary string of 4 octets
 *
 * @returns {string} - the concatenated binary string;
 */
function binary() {
    var randomOctets = [
        lodash_1.random(0, 255),
        lodash_1.random(0, 255),
        lodash_1.random(0, 255),
        lodash_1.random(0, 255),
    ];
    var binaryString = randomOctets
        .reduce(function (currentBinaryString, randomNumber, index) {
        var binaryRepresentationOfRandomNumber = randomNumber.toString(2);
        if (index === 0) {
            return binaryRepresentationOfRandomNumber;
        }
        return currentBinaryString + ' ' + binaryRepresentationOfRandomNumber;
    }, '');
    return binaryString;
}
exports.binaryFormatter = { formatName: 'binary', callback: binary };
//# sourceMappingURL=binary.js.map