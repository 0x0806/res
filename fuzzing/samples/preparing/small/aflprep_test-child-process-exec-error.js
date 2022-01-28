'use strict';
const assert = require('assert');
const child_process = require('child_process');
function test(fn, code, expectPidType = 'number') {
  const child = fn('does-not-exist', common.mustCall(function(err) {
    assert.strictEqual(err.code, code);
    assert(err.cmd.includes('does-not-exist'));
  }));
  assert.strictEqual(typeof child.pid, expectPidType);
}
if (common.isWindows) {
} else {
}
test(child_process.execFile, 'ENOENT', 'undefined');
