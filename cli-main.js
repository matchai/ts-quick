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
    }
  }
})

const {input, flags: options} = cli;

/**
 * Format and log the reported results.
 * @param {object[]} diagnostics - A list of reported diagnostics from TypeScript
 */
function log(diagnostics) {
  const reporter = tsQuick.typescriptFormatter;
  process.stdout.write(reporter(diagnostics));
  process.exit(diagnostics.length === 0 ? 0 : 1 );
}

async function main() {
  const diagnostics = await tsQuick.analyzeFiles(input, options)
  log(diagnostics);
}

main();
