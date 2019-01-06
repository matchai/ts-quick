const path = require("path");
const ts = require("typescript");

// The map of severity status to severity codes for ESLint
const eslintSeverityMap = {
  error: 2,
  warn: 1,
  off: 0
};

/**
 * Adapt TypeScript diagnostics to the structure accepted by ESLint formatters
 * @param {ts.Diagnostic[]} diagnostics - A list of all reported diagnostics from TypeScript
 * @returns {Object}
 */
function adaptDiagnostics(diagnostics) {
  const diagnosticsPerFile = splitDiagnosticsByFile(diagnostics);
  return diagnosticsToEslintResults(diagnosticsPerFile);
}

/**
 * Adapt TypeScript diagnostics per file to ESLint formatted object
 * @param {Object} diagnosticsPerFile - A list of diagnostics per filepath
 */
function diagnosticsToEslintResults(diagnosticsPerFile) {
  return Object.entries(diagnosticsPerFile).reduce((acc, cur) => {
    const [filePath, diagnostics] = cur;
    let results = {
      filePath,
      messages: diagnostics.map(formatDiagnostic),
      source: diagnostics[0].file.text
    };

    results = addStatusCount(results, "error", eslintSeverityMap.error);
    results = addStatusCount(results, "warning", eslintSeverityMap.warn);

    acc.push(results);
    return acc;
  }, []);
}

/**
 * Add status counts to the final results object
 * @param {Object} eslintResults - An eslint results object
 * @param {*} statusType - The name of the status (e.g. "error", "warning")
 * @param {*} statusCode - The code of the associated status
 */
function addStatusCount(eslintResults, statusType, statusCode) {
  const results = Object.assign({}, eslintResults);

  results[`${statusType}Count`] = results.messages.reduce((acc, cur) => {
    return (acc += cur.severity === statusCode ? 1 : 0);
  }, 0);

  return results;
}

/**
 * Reformat a diagnostic to have the properties of the output of eslint
 * @param {ts.Diagnostic} originalDiagnostic - A TypeScript diagnostic
 * @returns {Object}
 */
function formatDiagnostic(originalDiagnostic) {
  let diagnostic = Object.assign({}, originalDiagnostic);
  diagnostic = categoryToSeverity(diagnostic);
  diagnostic = codeToRuleId(diagnostic);
  diagnostic = messageTextToMessage(diagnostic);
  diagnostic = addLineAndColumn(diagnostic);
  diagnostic = removeUnusedKeys(diagnostic);
  return diagnostic;
}

/**
 * Typescript categories range from 0 to 3 (Warning, Error, Suggestion, Message)
 * ESLint severities range from 1 to 2 (Warning, Error)
 * Convert all non-errors into warnings,
 * @param {Object} originalDiagnostic - A TypeScript diagnostic
 * @returns {Object}
 */
function categoryToSeverity(originalDiagnostic) {
  const diagnostic = Object.assign({}, originalDiagnostic);

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
 * @param {Object} originalDiagnostic - A TypeScript diagnostic
 * @returns {Object}
 */
function codeToRuleId(originalDiagnostic) {
  const diagnostic = Object.assign({}, originalDiagnostic);
  const { code } = diagnostic;
  delete diagnostic.code;
  diagnostic.ruleId = `TS${code}`;
  return diagnostic;
}

/**
 * Convert a Typescript messageText to a message
 * @param {Object} originalDiagnostic - A TypeScript diagnostic
 */
function messageTextToMessage(originalDiagnostic) {
  const diagnostic = Object.assign({}, originalDiagnostic);
  const { messageText } = diagnostic;
  delete diagnostic.messageText;
  diagnostic.message = messageText;
  return diagnostic;
}

/**
 * Replace existing "file" and "start" keys with ESLint-style "line" and "column" keys
 * @param {ts.Diagnostic} originalDiagnostic - A TypeScript diagnostic
 * @returns {Object}
 */
function addLineAndColumn(originalDiagnostic) {
  /** @type {Object} */
  const diagnostic = Object.assign({}, originalDiagnostic);
  const { file, start } = diagnostic;
  const { line, character } = ts.getLineAndCharacterOfPosition(file, start);
  delete diagnostic.start;
  diagnostic.line = line;
  diagnostic.column = character;
  return diagnostic;
}

/**
 * Delete keys that are only used by TypeScript but are unused by ESLint
 * @param {Object} originalDiagnostic - The TypeScript diagnostic after having ESLint keys added to it
 */
function removeUnusedKeys(originalDiagnostic) {
  const diagnostic = Object.assign({}, originalDiagnostic);
  delete diagnostic.length;
  delete diagnostic.reportsUnnecessary;
  delete diagnostic.relatedInformation;
  delete diagnostic.file;
  return diagnostic;
}

/**
 * Split a list of diagnostics by file where the diagnostic is from
 * @param {ts.Diagnostic[]} diagnostics - A list of TypeScript diagnostics
 */
function splitDiagnosticsByFile(diagnostics) {
  /** @type {Object.<string, Object>} */
  const startingObj = {};
  const currentDir = process.cwd();

  return diagnostics.reduce((acc, cur) => {
    const filePath = cur.file.fileName;
    const absoluteFilePath = path.resolve(filePath);
    const relativePath = path.relative(currentDir, absoluteFilePath);

    if (acc[relativePath]) {
      acc[relativePath].push(cur);
    } else {
      acc[relativePath] = [cur];
    }
    return acc;
  }, startingObj);
}

module.exports.adaptDiagnostics = adaptDiagnostics;
module.exports.categoryToSeverity = categoryToSeverity;
module.exports.codeToRuleId = codeToRuleId;
