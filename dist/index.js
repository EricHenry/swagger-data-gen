#! /usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// import dependencies
var fs = require("fs");
var readline = require("readline");
var argparse_1 = require("argparse");
var SwaggerDataGen_1 = require("./src/SwaggerDataGen");
var INPUT_ARG = 'swagger-input';
var OUTPUT_ARG = 'json-output';
// grab expected user input
var parser = new argparse_1.ArgumentParser({
    addHelp: true,
    description: 'Swagger Data Generator generates mock data from Swagger files.'
});
var args;
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
parser.addArgument(['-y'], { help: 'Always overwrite output file (do not ask to overwrite)', action: 'storeTrue', dest: 'force-yes' });
parser.addArgument([INPUT_ARG], { help: 'Input Swagger file' });
parser.addArgument([OUTPUT_ARG], { help: 'Output file for generated mock data' });
args = parser.parseArgs();
SwaggerDataGen_1.build(args[INPUT_ARG])
    .then(function (api) { return saveOutput(SwaggerDataGen_1.generate(api)); });
//# sourceMappingURL=index.js.map