const adapter = require("../lib/eslint-formatter-adapter");

describe("categoryToSeverity", () => {
  it("correctly adapts an error", () => {
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

describe("codeToRuleId", () => {
  it("correctly converts code to ruleId", () => {
    const diagnostic = { code: 7006 };
    const result = adapter.codeToRuleId(diagnostic);
    expect(result).toEqual({ ruleId: "TS7006" });
  });
});
