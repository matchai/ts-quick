const path = require('path');
const ts = require('typescript');
const globby = require('globby');
const arrify = require('arrify');

const defaultConfig = {
  allowJs: true,
  checkJs: true,
  noEmit: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.Latest,
  jsx: true,
  module: ts.ModuleKind.CommonJS
};

const defaultExtensions = ['js', 'jsx'];

const defaultIgnore = [
  '**/node_modules/**',
	'**/bower_components/**',
	'flow-typed/**',
	'coverage/**',
	'{tmp,temp}/**',
	'**/*.min.js',
	'vendor/**',
	'dist/**'
]

const defaultOptions = {
  config: defaultConfig,
  extensions: defaultExtensions,
  ignore: defaultIgnore,
  cwd: path.resolve(process.cwd())
}

/**
 * Statically analyze the provided fileNames with TypeScript.
 * @param {string[]} patterns - A list of glob patterns.
 * @param {object} options - The compiler options which should be used by TypeScript.
 */
async function analyzeFiles(patterns, options) {
  options = options || defaultOptions;

  const isEmptyPatterns = patterns.length === 0;
  const defaultPattern = `**/*.{${options.extensions.join(',')}}`;

  const paths = await globby(
    isEmptyPatterns ? [defaultPattern] : arrify(patterns), {
      ignore: options.ignore,
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
 * @param {object[]} allDiagnostics - A list of all reported diagnostics from TypeScript.
 */
function typescriptFormatter(allDiagnostics) {
  return ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => ts.sys.newLine
  })
}

module.exports.analyzeFiles = analyzeFiles;
module.exports.typescriptFormatter = typescriptFormatter;
