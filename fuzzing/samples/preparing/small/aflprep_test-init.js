'use strict';
const assert = require('assert');
const child = require('child_process');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
if (process.env.TEST_INIT) {
  return process.stdout.write('Loaded successfully!');
}
process.env.TEST_INIT = 1;
function test(file, expected) {
  const path = `"${process.execPath}" ${file}`;
  child.exec(path, { env: process.env }, common.mustSucceed((out) => {
    assert.strictEqual(out, expected, `'node ${file}' failed!`);
  }));
}
{
  process.chdir(__dirname);
  test('test-init', 'Loaded successfully!');
  test('test-init.js', 'Loaded successfully!');
}
{
  process.chdir(fixtures.path());
  test('test-init-index', 'Loaded successfully!');
}
{
  process.chdir(fixtures.path('test-init-native'));
  test('fs', 'fs loaded successfully');
}
