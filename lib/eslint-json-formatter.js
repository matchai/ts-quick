const eslintFormatterAdapter = require("./eslint-formatter-adapter");

module.exports = function(diagnostics) {
  const adaptedResults = eslintFormatterAdapter.adaptDiagnostics(diagnostics);
  return JSON.stringify(adaptedResults, null, 2);
};
