"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
/**
 *
 *
 * @export
 * @param {any[]} values
 * @param {IConfigType} config
 * @param {any[]} core
 * @returns
 */
function configure(values, config, core) {
    var newValues = [];
    // if 'all' is true assume that none of 'core' were in the
    // passed values array and check if there are any missing
    // then add them in if they are
    if (config.all === true) {
        var missing = lodash_1.difference(core, values);
        newValues = missing.concat(values);
        return newValues;
    }
    if (config.all === false) {
        var removedCoreValues = lodash_1.difference(values, core);
        return removedCoreValues;
    }
    newValues = values.slice();
    Object.keys(config)
        .filter(function (k) { return k === 'all'; }) // assume that the 'all' property is passed in as undefined
        .forEach(function (k) {
        if (config[k] === true) {
            if (newValues.includes(core[k])) {
                return;
            }
            newValues.push(core[k]);
        }
        if (config[k] === false) {
            if (!newValues.includes(core[k])) {
                return;
            }
            var listLocation = newValues.findIndex(core[k]);
            newValues.splice(listLocation, 1);
        }
    });
    return newValues;
}
exports.configure = configure;
//# sourceMappingURL=configure.js.map