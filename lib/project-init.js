const path = require("path");
const readPkgUp = require("read-pkg-up");
const writePkg = require("write-pkg");
// @ts-ignore: No type declaration exists
const hasYarn = require("has-yarn");
const execa = require("execa");

const DEFAULT_TEST_SCRIPT = 'echo "Error: no test specified" && exit 1';

/**
 * Create a new test script, prepending ts-quick as a test step
 * @param {string} test - The previous test script from package.json
 */
function buildTestScript(test) {
  if (test && test !== DEFAULT_TEST_SCRIPT) {
    // Don't add if it's already there
    if (!/^ts-quick( |$)/.test(test)) {
      return `ts-quick && ${test}`;
    }

    return test;
  }

  return "ts-quick";
}

/**
 * Initialize a project by installing ts-script and adding it to the test script
 * @param {Object} options - An object containing the CLI flags
 */
async function projectInit(options = {}) {
  const pkgData = await readPkgUp({
    cwd: options.cwd,
    normalize: false
  });
  const pkg = pkgData.pkg || {};
  const pkgPath =
    pkgData.path || path.resolve(options.cwd || "", "package.json");
  const pkgCwd = path.dirname(pkgPath);

  pkg.scripts = pkg.scripts || {};
  pkg.scripts.test = buildTestScript(pkg.scripts.test);

  await writePkg(pkgPath, pkg);

  if (hasYarn(pkgCwd)) {
    return execa(
      "yarn",
      ["add", "--dev", "--ignore-workspace-root-check", "ts-quick"],
      { cwd: pkgCwd }
    );
  }

  return execa("npm", ["install", "--save-dev", "ts-quick"], { cwd: pkgCwd });
}

module.exports = projectInit;
