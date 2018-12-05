#!/usr/bin/env node
'use strict';
const meow = require('meow');
const tsQuick = require('.');

const cli = meow(`
  Usage
    $ ts-quick [<file|glob> ...]

  Examples
    $ ts-quick
    $ ts-quick index.js
    $ ts-quick *.js !foo.js
`)

/**
 * Format and log the reported results.
 * @param {string[]} diagnostics - A list of reported diagnostics from TypeScript
 */
function log(diagnostics) {
  const reporter = tsQuick.typescriptFormatter;
  process.stdout.write(reporter(diagnostics));
  process.exit(diagnostics.length === 0 ? 0 : 1 );
}

async function main() {
  const {input} = cli;

  const diagnostics = await tsQuick.analyzeFiles(input)
  log(diagnostics);
}

main();
