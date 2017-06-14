#! /usr/bin/env node
'use strict';

// import dependencies
import * as fs from 'fs';
import * as readline from 'readline';
import { ArgumentParser } from 'argparse';
// const { ArgumentParser } = require('argparse');
import { SwaggerDataGenerator } from './src/SwaggerDataGenerator';

// grab expected user input
const parser = new ArgumentParser({
  addHelp: true,
  description: 'Swagger Data Generator generates mock data from Swagger files.'
});
let args: string[];
parser.addArgument(['-y'], { help: 'Always overwrite output file (do not ask to overwrite)', action: 'storeTrue', dest: 'force-yes' });
parser.addArgument(['swagger-input'], { help: 'Input Swagger file' });
parser.addArgument(['json-output'], { help: 'Output file for generated mock data' });
args = parser.parseArgs();

const sdg = new SwaggerDataGenerator(args['swagger-input']);

sdg
  .run()
  .then(() => saveOutput(sdg.generateMockData()));

/**
 * saveOutput - Verify output path and save file
 *
 * @param generatedData {Object} - containes the key-value pairs of definition and its created data
 */
function saveOutput(generatedData: {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function writeData(yes: boolean) {
    if (yes) {
      fs.writeSync(fs.openSync(args['json-output'], 'w'),
        JSON.stringify(generatedData, null, '\t'));
    } else {
      rl.write('...Aborting\n');
    }
    rl.close();
    process.stdin.pause();
  }

  if (args['force-yes']) {
    writeData(true);
  } else {
    rl.question('content in ' + args['json-output'] + ' will be overwritten. continue? (y or n): ',
      function handleAnswer(answer) {
        writeData(answer === 'y' || answer === 'Y');
      });
  }
}
