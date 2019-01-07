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

test("the eslint json adapter finds errors", async () => {
  const cwd = path.join(__dirname, "fixtures/default");

  let error;
  try {
    await main(["--reporter=eslint-json"], { cwd });
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

test("implicitAny ignores missing type annotations", async () => {
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

test("correctly ignores files in .gitignore", async () => {
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

test("correctly ignores files explicitly called when also in .gitignore", async () => {
  const cwd = path.join(__dirname, "fixtures/gitignore");

  let error;
  try {
    await main(["test/foo.js", "--reporter=json"], { cwd });
  } catch (err) {
    error = err;
  }

  expect(error).toBeUndefined();
});

test("correctly locates negative gitignores", async () => {
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
