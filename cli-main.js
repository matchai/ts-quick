#!/usr/bin/env node
'use strict';
const meow = require('meow');
const tsQuick = require('.');

const cli = meow(`
  Usage
    $ ts-quick [<file|glob> ...]

  Options
    --implicitAny  Allow variables to implicitly have the "any" type
    --ignore       Additional paths to ignore  [Can be set multiple times]
    --cwd=<dir>    Working directory for files

  Examples
    $ ts-quick
    $ ts-quick index.js
    $ ts-quick *.js !foo.js
    $ ts-quick --implicitAny
`, {
  booleanDefault: undefined,
  flags:{
    implicitAny: {
      type: 'boolean'
    },
    ignore: {
      type: 'string'
    },
    cwd: {
      type: 'string'
    },
    // WIP: Only present for testing
    reporter: {
      type: 'string'
    }
  }
})

const {input, flags: options} = cli;

/**
 * Format and log the reported results.
 * @param {object[]} diagnostics - A list of reported diagnostics from TypeScript
 */
function log(diagnostics) {
  let reporter = tsQuick.typescriptFormatter;

  if (options.reporter === 'json') {
    reporter = require('./lib/jsonFormatter');
  }

  console.log(reporter(diagnostics));
  process.exit(diagnostics.length === 0 ? 0 : 1 );
}

async function main() {
  const diagnostics = await tsQuick.analyzeFiles(input, options)
  log(diagnostics);
}

main();
