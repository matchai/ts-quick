/**
 * Format TypeScript diagnostics as a JSON object
 * @param {Object[]} diagnostics - The list of diagnostics from TypeScript
 */
function jsonFormatter(diagnostics) {
  // TODO: The bulk of the output is stripped until circular references are solved
  return JSON.stringify(diagnostics, (key, val) => {
    if (key !== "file") {
      return val;
    }
    const { fileName } = val;
    return { fileName };
  });
}

module.exports = jsonFormatter;
