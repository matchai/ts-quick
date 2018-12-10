const ts = require("typescript");

/**
 * Adapt TypeScript diagnostics to the structure accepted by ESLint formatters
 * @param {ts.Diagnostic[]} diagnostics - A list of all reported diagnostics from TypeScript.
 */
function adaptDiagnostics(diagnostics) {
  debugger;
  const formattedResults = diagnostics.map(diagnostic => {
    return formatDiagnostic(diagnostic);
  });

  return formattedResults;
}

function formatDiagnostic(diagnostic) {
  diagnostic = categoryToSeverity(diagnostic);
}

/**
 * Typescript categories range from 0 to 3 (Warning, Error, Suggestion, Message)
 * ESLint severities range from 1 to 2 (Warning, Error)
 * Converts all non-errors into warnings,
 * @param {number} category - A TypeScript diagnostic category value
 * @returns {number}
 */
function categoryToSeverity(diagnostic) {
  const eslintSeverityMap = {
    error: 2,
    warn: 1,
    off: 0
  };

  let severity;
  if (diagnostic.category === ts.DiagnosticCategory.Error) {
    severity = eslintSeverityMap.error;
  } else {
    severity = eslintSeverityMap.warn;
  }

  delete diagnostic.category;
  diagnostic.severity = severity;
  return diagnostic;
}

module.exports.adaptDiagnostics = adaptDiagnostics;
module.exports.categoryToSeverity = categoryToSeverity;
