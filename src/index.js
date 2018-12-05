const ts = require('typescript')

/**
 * Statically analyze the provided fileNames with TypeScript
 * 
 * @param {string[]} fileNames - A list of files.
 * @param {object} options - The compiler options which should be used by TypeScript.
 */
function analyze(fileNames, options) {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => ts.sys.newLine
  })

  console.log(formattedDiagnostics)

  let exitCode = allDiagnostics.length ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

analyze(process.argv.slice(2), {
  allowJs: true,
  checkJs: true,
  noEmit: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.Latest,
  jsx: true,
  module: ts.ModuleKind.CommonJS
});
