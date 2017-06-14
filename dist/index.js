#! /usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// import dependencies
var fs = require("fs");
var readline = require("readline");
var argparse_1 = require("argparse");
// const { ArgumentParser } = require('argparse');
var SwaggerDataGenerator_1 = require("./src/SwaggerDataGenerator");
// grab expected user input
var parser = new argparse_1.ArgumentParser({
    addHelp: true,
    description: 'Swagger Data Generator generates mock data from Swagger files.'
});
var args;
parser.addArgument(['-y'], { help: 'Always overwrite output file (do not ask to overwrite)', action: 'storeTrue', dest: 'force-yes' });
parser.addArgument(['swagger-input'], { help: 'Input Swagger file' });
parser.addArgument(['json-output'], { help: 'Output file for generated mock data' });
args = parser.parseArgs();
var sdg = new SwaggerDataGenerator_1.SwaggerDataGenerator(args['swagger-input']);
sdg
    .run()
    .then(function () { return saveOutput(sdg.generateMockData()); });
/**
 * saveOutput - Verify output path and save file
 *
 * @param generatedData {Object} - containes the key-value pairs of definition and its created data
 */
function saveOutput(generatedData) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    function writeData(yes) {
        if (yes) {
            fs.writeSync(fs.openSync(args['json-output'], 'w'), JSON.stringify(generatedData, null, '\t'));
        }
        else {
            rl.write('...Aborting\n');
        }
        rl.close();
        process.stdin.pause();
    }
    if (args['force-yes']) {
        writeData(true);
    }
    else {
        rl.question('content in ' + args['json-output'] + ' will be overwritten. continue? (y or n): ', function handleAnswer(answer) {
            writeData(answer === 'y' || answer === 'Y');
        });
    }
}
//# sourceMappingURL=index.js.map