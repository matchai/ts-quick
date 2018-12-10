const path = require("path");
const ts = require("typescript");
const globby = require("globby");
const arrify = require("arrify");
const optionsManager = require("./lib/options-manager");

/**
 * Statically analyze the provided fileNames with TypeScript.
 * @param {string[]} patterns - A list of glob patterns.
 * @param {object} options - The compiler options which should be used by TypeScript.
 */
async function analyzeFiles(patterns, options) {
  options = optionsManager.buildConfig(options);

  const isEmptyPatterns = patterns.length === 0;
  const defaultPattern = `**/*.{js,jsx,ts,tsx}`;

  const paths = await globby(
    isEmptyPatterns ? [defaultPattern] : arrify(patterns),
    {
      ignore: options.ignores,
      gitignore: true,
      cwd: options.cwd
    }
  );

  let program = ts.createProgram(paths, options.config);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  return allDiagnostics;
}

/**
 * Format all provided diagnostics with the TypeScript-provided formatter.
 * @param {ts.Diagnostic[]} allDiagnostics - A list of all reported diagnostics from TypeScript.
 */
function typescriptFormatter(allDiagnostics) {
  return ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => ts.sys.newLine
  });
}

module.exports.analyzeFiles = analyzeFiles;
module.exports.typescriptFormatter = typescriptFormatter;
