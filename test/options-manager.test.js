const manager = require('../lib/options-manager');

test('normalizeOptions: makes all the options plural and arrays', () => {
  const options = manager.normalizeOptions({
    ignore: 'test.js'
  })

  expect(options).toMatchObject({
    ignores: ['test.js']
  })
})

test('normalizeOptions: falsey values remain falsey', () => {
  expect(manager.normalizeOptions({})).toEqual({});
})

test('buildConfig: defaults', () => {
  const options = manager.buildConfig({});
  expect(options.config).toMatchObject({
    allowJs: true,
    checkJs: true,
    noEmit: true,
    noImplicitAny: true,
    target: 6,
    jsx: true,
    module: 1,
    cwd: expect.any(String)
  })
  expect(options.ignores).toEqual([ 
    '**/node_modules/**',
    '**/bower_components/**',
    'flow-typed/**',
    'coverage/**',
    '{tmp,temp}/**',
    '**/*.min.js',
    'vendor/**',
    'dist/**' 
  ]);
})
