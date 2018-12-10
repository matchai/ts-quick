#!/usr/bin/env node
"use strict";
const ts = require("typescript");
const meow = require("meow");
const tsQuick = require(".");
const projectInit = require("./lib/project-init");

const cli = meow(
  `
  Usage
    $ ts-quick [<file|glob> ...]

  Options
    --init         Add ts-quick to your project
    --implicitAny  Allow variables to implicitly have the "any" type
    --ignore       Additional paths to ignore  [Can be set multiple times]
    --cwd=<dir>    Working directory for files

  Examples
    $ ts-quick
    $ ts-quick index.js
    $ ts-quick *.js !foo.js
    $ ts-quick --init
    $ ts-quick --implicitAny

  Tips
    Put options in package.json instead of using flags so other tools can read it.
`,
  {
    booleanDefault: undefined,
    flags: {
      init: {
        type: "boolean"
      },
      implicitAny: {
        type: "boolean"
      },
      ignore: {
        type: "string"
      },
      cwd: {
        type: "string"
      },
      // WIP: Only present for testing
      reporter: {
        type: "string"
      }
    }
  }
);

const { input, flags: options } = cli;

/**
 * Format and log the reported results.
 * @param {ts.Diagnostic[]} diagnostics - A list of reported diagnostics from TypeScript
 */
function log(diagnostics) {
  let reporter = tsQuick.typescriptFormatter;

  if (options.reporter === "json") {
    reporter = require("./lib/json-formatter");
  }

  process.stdout.write(reporter(diagnostics));
  process.exit(diagnostics.length === 0 ? 0 : 1);
}

async function main() {
  if (options.init) {
    await projectInit(options);
  } else {
    const diagnostics = await tsQuick.analyzeFiles(input, options);
    log(diagnostics);
  }
}

main();
