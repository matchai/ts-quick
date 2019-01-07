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

describe("messageTextToMessage", () => {
  it("correctly converts a TypeScript messageText to an ESLint report message", () => {
    const diagnostic = { messageText: "Cannot find name 'add'." };
    const result = adapter.messageTextToMessage(diagnostic);
    expect(result).toEqual({ message: "Cannot find name 'add'." });
  });
});

describe("addLineAndColumn", () => {
  it("corectly sets line and column from TypeScript diagnostic", () => {
    const diagnostic = {
      message: "Cannot find name 'add'.",
      file: {
        text: "add(1, 2);\n",
        lineMap: [0, 11]
      },
      start: 16
    };
    const result = adapter.addLineAndColumn(diagnostic);
    expect(result).toEqual({
      message: "Cannot find name 'add'.",
      file: {
        text: "add(1, 2);\n",
        lineMap: [0, 11]
      },
      line: 1,
      column: 5
    });
  });
});

describe("removeUnusedKeys", () => {
  it("correctly deletes the unneeded keys", () => {
    const diagnostic = {
      messageText: "Cannot find name 'add'.",
      length: 1,
      reportsUnnecessary: null,
      relatedInformation: "Here is some related information",
      file: {
        pos: 0,
        end: 11,
        flags: 65536,
        transformFlags: 536870912,
        parent: undefined,
        kind: 279,
        text: "add(1, 2);\n"
      }
    };
    const result = adapter.removeUnusedKeys(diagnostic);
    expect(result).toEqual({ messageText: "Cannot find name 'add'." });
  });
});

describe("addStatusCount", () => {
  it("correctly adds status counters", () => {
    let results = {
      messages: [{ severity: 1 }, { severity: 1 }, { severity: 2 }]
    };

    results = adapter.addStatusCount(results, "warning", 1);

    expect(results).toEqual({
      messages: [{ severity: 1 }, { severity: 1 }, { severity: 2 }],
      warningCount: 2
    });

    results = adapter.addStatusCount(results, "error", 2);

    expect(results).toEqual({
      messages: [{ severity: 1 }, { severity: 1 }, { severity: 2 }],
      warningCount: 2,
      errorCount: 1
    });
  });
});
