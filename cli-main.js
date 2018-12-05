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

function log(diagnostics) {
  const reporter = tsQuick.typescriptFormatter;
  process.stdout.write(reporter(diagnostics));
  process.exit(diagnostics.length === 0 ? 0 : 1 );
}

const {input} = cli;

tsQuick.analyzeFiles(input).then(diagnostics => {
  log(diagnostics);
});
