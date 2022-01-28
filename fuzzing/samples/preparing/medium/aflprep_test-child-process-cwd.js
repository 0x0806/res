'use strict';
tmpdir.refresh();
const assert = require('assert');
const { spawn } = require('child_process');
const { pathToFileURL, URL } = require('url');
function testCwd(options, expectPidType, expectCode = 0, expectData) {
  const child = spawn(...common.pwdCommand, options);
  assert.strictEqual(typeof child.pid, expectPidType);
  child.stdout.setEncoding('utf8');
  let data = '';
  child.stdout.on('data', function(chunk) {
    data += chunk;
  });
  child.on('exit', function(code, signal) {
    assert.strictEqual(code, expectCode);
  });
  child.on('close', common.mustCall(function() {
    expectData && assert.strictEqual(data.trim(), expectData);
  }));
  return child;
}
{
  testCwd({ cwd: 'does-not-exist' }, 'undefined', -1)
    .on('error', common.mustCall(function(e) {
      assert.strictEqual(e.code, 'ENOENT');
    }));
}
{
  assert.throws(() => {
    testCwd({
    }, 'number', 0, tmpdir.path);
  if (process.platform !== 'win32') {
    assert.throws(() => {
      testCwd({
      }, 'number', 0, tmpdir.path);
  }
}
testCwd({ cwd: tmpdir.path }, 'number', 0, tmpdir.path);
testCwd({ cwd: shouldExistDir }, 'number', 0, shouldExistDir);
testCwd({ cwd: pathToFileURL(tmpdir.path) }, 'number', 0, tmpdir.path);
testCwd({ cwd: '' }, 'number');
testCwd({ cwd: undefined }, 'number');
testCwd({ cwd: null }, 'number');
