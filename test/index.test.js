const path = require('path');
const execa = require('execa');

process.chdir(__dirname);

const main = (args, options) => execa(path.join(__dirname, '../cli-main.js'), args, options);

test('ignore files in .gitignore', async () => {
  // TODO: Figure out why the spy on write isn't being called
  // const write = jest.spyOn(process.stdout, 'write');
  const cwd = path.join(__dirname, 'fixtures/gitignore');

  let err;
  try {
    await main([], {cwd});
  } catch(error) {
    err = error
  }

  expect(err).toMatchSnapshot();
});
