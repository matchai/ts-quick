const path = require("path");
const ts = require("typescript");
const arrify = require("arrify");
const pkgConf = require("pkg-conf");

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/bower_components/**",
  "flow-typed/**",
  "coverage/**",
  "{tmp,temp}/**",
  "**/*.min.js",
  "vendor/**",
  "dist/**"
];

const DEFAULT_CONFIG = {
  allowJs: true,
  checkJs: true,
  noEmit: true,
  noImplicitAny: true,
  target: ts.ScriptTarget.Latest,
  jsx: true,
  module: ts.ModuleKind.CommonJS
};

const defaultOptions = {
  config: DEFAULT_CONFIG
};

/**
 * Normalize all options with plural versions of their option names.
 * @param {object} options - Options provided by the user as cli flags
 */
function normalizeOptions(options) {
  options = Object.assign({}, options);

  const aliases = ["ignore"];

  for (const singular of aliases) {
    const plural = singular + "s";
    let value = options[plural] || options[singular];

    delete options[singular];

    if (value === undefined) {
      continue;
    }

    options[plural] = arrify(value);
  }

  return options;
}

/**
 * Merge the options provided as flags with the options in package.json
 * @param {object} options - Options provided by the user as cli flags
 */
function mergeWithPkgConf(options) {
  options = { cwd: process.cwd(), ...options };
  options.cwd = path.resolve(options.cwd);
  const config = pkgConf.sync("ts-quick", {
    cwd: options.cwd,
    skipOnFalse: true
  });
  return { ...config, ...options };
}

/**
 * Restructure user-provided options and merge them with default options to
 * build a config, as required by the TypeScript compiler.
 * @param {object} options - Options provided by the user as cli flags
 */
function buildConfig(options) {
  options = mergeWithPkgConf(options);
  options = normalizeOptions(options);
  options = { ...defaultOptions, ...options };

  if (options.implicitAny) {
    options.config.noImplicitAny = !options.implicitAny;
  }

  options.ignores = DEFAULT_IGNORE.concat(options.ignores || []);
  return options;
}

module.exports.buildConfig = buildConfig;
module.exports.mergeWithPkgConf = mergeWithPkgConf;
module.exports.normalizeOptions = normalizeOptions;
