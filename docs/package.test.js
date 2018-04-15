test('package.json is valid json', () => {
  const pkg = require('./package.json');
  expect(pkg.license).toEqual('MIT');
});
