const path = require('path');
const execa = require('execa');

process.chdir(__dirname);

const main = (args, options) => execa(path.join(__dirname, '../cli-main.js'), args, options);

test('ignore files in .gitignore', async () => {
  const cwd = path.join(__dirname, 'fixtures/gitignore');

  let error;
  try {
    await main(['--reporter=json'], {cwd});
  } catch(err) {
    error = err;
  }

  const diagnostics = JSON.parse(error.stdout);
  expect(diagnostics).toHaveLength(1);
  expect(diagnostics[0]).toHaveProperty('file.fileName', 'bar.js');
  expect(diagnostics[0]).toHaveProperty('messageText', 'Parameter \'n\' implicitly has an \'any\' type.');
});
