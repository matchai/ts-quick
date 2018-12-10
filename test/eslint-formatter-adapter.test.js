const adapter = require("../lib/eslint-formatter-adapter");

describe("categoryToSeverity", () => {
  it('correctly adapts an "error"', () => {
    const diagnostic = { category: 1 };

    const result = adapter.categoryToSeverity(diagnostic);
    expect(result).toEqual({ severity: 2 });
  });

  it.each([["warning", 0], ["suggestion", 2], ["message", 3]])(
    "correctly adapts a %s",
    ([diagnosticType, code]) => {
      const diagnostic = { category: code };

      const result = adapter.categoryToSeverity(diagnostic);
      expect(result).toEqual({ severity: 1 });
    }
  );
});
