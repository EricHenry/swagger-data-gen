const jsf = require('json-schema-faker');
const generators = require('./generators/generators.js');

jsf.format('date', generators.fullDate);
jsf.format('byte', generators.byte);
jsf.format('binary', generators.binary);
jsf.format('password', generators.password);

module.exports = jsf;
