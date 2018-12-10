const ts = require("typescript");

/**
 * Adapt TypeScript diagnostics to the structure accepted by ESLint formatters
 * @param {ts.Diagnostic[]} diagnostics - A list of all reported diagnostics from TypeScript.
 */
function diagnosticAdapter(diagnostics) {
  const formattedResults = diagnostics.map(diagnostic => {
    return formatDiagnostic(diagnostic);
  });

  return formattedResults;
}

function formatDiagnostic(diagnostic) {
  const formattedResult = {};
}

/**
 * Typescript categories range from 0 to 3 (Warning, Error, Suggestion, Message)
 * ESLint severities range from 1 to 2 (Warning, Error)
 * Converts all non-errors into warnings,
 * @param {number} category - A TypeScript diagnostic category value
 * @returns {number}
 */
function categoryToSeverity(category) {
  const eslintSeverityMap = {
    error: 2,
    warn: 1,
    off: 0
  };

  if (category === ts.DiagnosticCategory.Error) {
    return eslintSeverityMap.error;
  }

  return eslintSeverityMap.warn;
}
