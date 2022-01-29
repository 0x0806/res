'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const cp = require('child_process');
const path = require('path');
function test(execArgv) {
  const child = cp.spawn(process.execPath, execArgv);
  child.stderr.once('data', common.mustCall(function() {
    child.kill('SIGTERM');
  }));
  child.on('exit', common.mustCall(function(code, signal) {
    assert.strictEqual(signal, 'SIGTERM');
  }));
}
test([
  '--require',
  '--inspect-brk',
]);
