const path = require("path");
const execa = require("execa");

const main = (args, options) =>
  execa(path.join(__dirname, "../cli-main.js"), args, options);

test("the default configuration finds errors", async () => {
  const cwd = path.join(__dirname, "fixtures/default");

  let error;
  try {
    await main(["--reporter=json"], { cwd });
  } catch (err) {
    error = err;
  }

  const diagnostics = JSON.parse(error.stdout);
  expect(diagnostics).toHaveLength(2);
  expect(diagnostics[0]).toHaveProperty("file.fileName", "bar.js");
  expect(diagnostics[0]).toHaveProperty(
    "messageText",
    "Cannot find name 'add'."
  );
  expect(diagnostics[1]).toHaveProperty("file.fileName", "foo.js");
  expect(diagnostics[1]).toHaveProperty(
    "messageText",
    "Parameter 'n' implicitly has an 'any' type."
  );
});

test("implicitAny ignores cases there's no type annotation", async () => {
  const cwd = path.join(__dirname, "fixtures/default");

  let error;
  try {
    await main(["--reporter=json", "--implicitAny"], { cwd });
  } catch (err) {
    error = err;
  }

  const diagnostics = JSON.parse(error.stdout);
  expect(diagnostics).toHaveLength(1);
  expect(diagnostics[0]).toHaveProperty("file.fileName", "bar.js");
  expect(diagnostics[0]).toHaveProperty(
    "messageText",
    "Cannot find name 'add'."
  );
});

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
