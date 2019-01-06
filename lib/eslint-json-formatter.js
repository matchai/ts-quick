const ts = require("typescript");
const eslintFormatterAdapter = require("./eslint-formatter-adapter");

/**
 * Generate a JSON object formatted for eslint reporters
 * @param {ts.Diagnostic[]} diagnostics - A list of TypeScript diagnostics
 */
function eslintJsonFormatter(diagnostics) {
  const adaptedResults = eslintFormatterAdapter.adaptDiagnostics(diagnostics);
  return JSON.stringify(adaptedResults, null, 2);
}

module.exports = eslintJsonFormatter;
