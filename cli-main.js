#!/usr/bin/env node
"use strict";
const ts = require("typescript");
const meow = require("meow");
const { analyzeFiles, getFormatter, typescriptFormatter } = require(".");
const { adaptDiagnostics } = require("./lib/eslint-formatter-adapter");
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
  // switch (options.reporter) {
  //   case "json":
  //     reporter = require("./lib/json-formatter");
  //     break;
  //   case "eslint-json":
  //     reporter = require("./lib/eslint-json-formatter");
  //     break;
  //   default:
  // reporter = tsQuick.getFormatter(options.reporter);
  // }
  let report;
  if (options.reporter) {
    const reporter = getFormatter(options.reporter);
    const results = adaptDiagnostics(diagnostics);
    report = reporter(results);
  } else {
    report = typescriptFormatter(diagnostics);
  }

  process.stdout.write(report);
  process.exit(diagnostics.length === 0 ? 0 : 1);
}

async function main() {
  if (options.init) {
    await projectInit(options);
  } else {
    const diagnostics = await analyzeFiles(input, options);
    log(diagnostics);
  }
}

main();
