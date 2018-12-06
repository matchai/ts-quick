const path = require("path");
const execa = require("execa");

const main = (args, options) =>
  execa(path.join(__dirname, "../cli-main.js"), args, options);

test("ignore files in .gitignore", async () => {
  const cwd = path.join(__dirname, "fixtures/gitignore");

  let error;
  try {
    await main(["--reporter=json"], { cwd });
  } catch (err) {
    error = err;
  }

  const diagnostics = JSON.parse(error.stdout);
  expect(diagnostics).toHaveLength(1);
  expect(diagnostics[0]).toHaveProperty("file.fileName", "bar.js");
  expect(diagnostics[0]).toHaveProperty(
    "messageText",
    "Parameter 'n' implicitly has an 'any' type."
  );
});

test("ignore files explicitly called when also in .gitignore", async () => {
  const cwd = path.join(__dirname, "fixtures/gitignore");

  let error;
  try {
    await main(["test/foo.js", "--reporter=json"], { cwd });
  } catch (err) {
    error = err;
  }

  expect(error).toBeUndefined();
});

test("negative gitignores", async () => {
  const cwd = path.join(__dirname, "fixtures/negative-gitignore");

  let error;
  try {
    await main(["--reporter=json"], { cwd });
  } catch (err) {
    error = err;
  }

  const diagnostics = JSON.parse(error.stdout);
  expect(diagnostics).toHaveLength(1);
  expect(diagnostics[0]).toHaveProperty("file.fileName", "foo.js");
  expect(diagnostics[0]).toHaveProperty(
    "messageText",
    "Parameter 'n' implicitly has an 'any' type."
  );
});
