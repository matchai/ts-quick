const path = require("path");
const ts = require("typescript");

/**
 * Adapt TypeScript diagnostics to the structure accepted by ESLint formatters
 * @param {ts.Diagnostic[]} diagnostics - A list of all reported diagnostics from TypeScript.
 */
function adaptDiagnostics(diagnostics, cwd) {
  const diagnosticsPerFile = diagnosticsByFile(diagnostics, cwd);
  formatDiagnostic(diagnostics[0]);
  debugger;

  // const formattedResults = diagnostics.map(diagnostic => {
  //   return formatDiagnostic(diagnostic);
  // });

  // return formattedResults;
}

function formatDiagnostic(diagnostic) {
  diagnostic = categoryToSeverity(diagnostic);
  diagnostic = codeToRuleId(diagnostic);
  diagnostic = messageTextToMessage(diagnostic);
  diagnostic = addLineAndColumn(diagnostic);
  return diagnostic;
}

/**
 * Typescript categories range from 0 to 3 (Warning, Error, Suggestion, Message)
 * ESLint severities range from 1 to 2 (Warning, Error)
 * Convert all non-errors into warnings,
 * @param {ts.Diagnostic} diagnostic - A TypeScript diagnostic category value
 * @returns {ts.Diagnostic}
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

/**
 * Convert a TypeScript code to a rule id
 * @param {ts.Diagnostic} diagnostic - A TypeScript diagnostic
 * @returns {ts.Diagnostic}
 */
function codeToRuleId(diagnostic) {
  const { code } = diagnostic;
  delete diagnostic.code;
  diagnostic.ruleId = `TS${code}`;
  return diagnostic;
}

/**
 * Convert a Typescript messageText to a message
 * @param {ts.Diagnostic} diagnostic - A TypeScript diagnostic
 */
function messageTextToMessage(diagnostic) {
  const { messageText } = diagnostic;
  delete diagnostic.messageText;
  diagnostic.message = messageText;
  return diagnostic;
}

function addLineAndColumn(diagnostic) {
  const { file, start } = diagnostic;
  const { line, character } = ts.getLineAndCharacterOfPosition(file, start);
  delete diagnostic.start;
  diagnostic.line = line;
  diagnostic.column = character;
  return diagnostic;
}

/**
 * Split a list of diagnostics by file where the diagnostic is from
 * @param {ts.Diagnostic[]} diagnostics - A list of TypeScript diagnostics
 * @returns {Object}
 */
function diagnosticsByFile(diagnostics) {
  return diagnostics.reduce((acc, cur) => {
    const relativePath = path.relative(process.cwd(), cur.file.path);
    if (acc[relativePath]) {
      acc[relativePath].push(cur);
    } else {
      acc[relativePath] = [cur];
    }
    return acc;
  }, {});
}

module.exports.adaptDiagnostics = adaptDiagnostics;
module.exports.categoryToSeverity = categoryToSeverity;
module.exports.codeToRuleId = codeToRuleId;
