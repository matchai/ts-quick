const ts = require("typescript");
const eslintFormatterAdapter = require("./eslint-formatter-adapter");

/**
 * Generate a JSON object formatted for eslint reporters
 * @param {ts.Diagnostic[]} diagnostics - A list of TypeScript diagnostics
 * @param {string} [cwd] - The path of the project being analyzed
 */
function eslintJsonFormatter(diagnostics, cwd) {
  const adaptedResults = eslintFormatterAdapter.adaptDiagnostics(
    diagnostics,
    cwd
  );
  return JSON.stringify(adaptedResults, null, 2);
}

module.exports = eslintJsonFormatter;
