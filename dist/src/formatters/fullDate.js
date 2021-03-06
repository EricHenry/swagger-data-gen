"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 * Generates a Date as a string in JSON Schema full-date format.
 *
 * @method     fullDate
 * @return     {string}  - a random date as a string.
 */
function fullDate() {
    var YEAR = lodash_1.random(1900, 2030);
    var MONTH = lodash_1.random(1, 12);
    var DAY = lodash_1.random(1, 28);
    var yearString = YEAR.toString();
    var monthString = MONTH < 10 ? '0' + MONTH.toString() : MONTH.toString();
    var dayString = DAY < 10 ? '0' + DAY.toString() : DAY.toString();
    return yearString + '-' + monthString + '-' + dayString;
}
exports.fullDateFormatter = { formatName: 'fullDate', callback: fullDate };
//# sourceMappingURL=fullDate.js.map