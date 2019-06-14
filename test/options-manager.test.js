const path = require("path");
const manager = require("../lib/options-manager");

describe("normalizeOptions", () => {
  it("makes all the options plural and arrays", () => {
    const options = manager.normalizeOptions({
      ignore: "test.js"
    });

    expect(options).toEqual({
      ignores: ["test.js"]
    });
  });

  it("keeps falsey values as falsey", () => {
    expect(manager.normalizeOptions({})).toEqual({});
  });
});

describe("buildConfig", () => {
  it("correctly outputs the defaults", () => {
    const cwd = path.join(__dirname, "fixtures/default");
    const options = manager.buildConfig({ cwd });
    expect(options.cwd).toMatch(/test\/fixtures\/default$/);
    expect(options.config).toEqual({
      allowJs: true,
      checkJs: true,
      noEmit: true,
      noImplicitAny: true,
      target: 8,
      jsx: true,
      module: 1
    });
    expect(options.ignores).toEqual([
      "**/node_modules/**",
      "**/bower_components/**",
      "flow-typed/**",
      "coverage/**",
      "{tmp,temp}/**",
      "**/*.min.js",
      "vendor/**",
      "dist/**"
    ]);
  });

  it("correctly accepts implicitAny", () => {
    const cwd = path.join(__dirname, "fixtures/default");
    const options = manager.buildConfig({ cwd, implicitAny: true });
    expect(options.cwd).toMatch(/test\/fixtures\/default$/);
    expect(options.config).toEqual({
      allowJs: true,
      checkJs: true,
      noEmit: true,
      noImplicitAny: false,
      target: 8,
      jsx: true,
      module: 1
    });
    expect(options.ignores).toEqual([
      "**/node_modules/**",
      "**/bower_components/**",
      "flow-typed/**",
      "coverage/**",
      "{tmp,temp}/**",
      "**/*.min.js",
      "vendor/**",
      "dist/**"
    ]);
  });
});

describe("mergeWithPkgConf", () => {
  it("correctly formats package config", () => {
    const cwd = path.join(__dirname, "fixtures/pkgConf");
    const options = manager.mergeWithPkgConf({ cwd });
    expect(options).toEqual({
      cwd: expect.stringMatching(/test\/fixtures\/pkgConf$/),
      ignore: "bar.js",
      implicitAny: false
    });
  });

  it("merges options with the package config and flags", () => {
    const cwd = path.join(__dirname, "fixtures/pkgConf");
    const options = manager.mergeWithPkgConf({ cwd, implicitAny: true });
    expect(options).toEqual({
      cwd: expect.stringMatching(/test\/fixtures\/pkgConf$/),
      ignore: "bar.js",
      implicitAny: true
    });
  });

  it("ignores missing package config", () => {
    const cwd = path.join(__dirname, "fixtures/default");
    const options = manager.mergeWithPkgConf({ cwd });
    expect(options).toEqual({
      cwd: expect.stringMatching(/test\/fixtures\/default$/)
    });
  });
});
