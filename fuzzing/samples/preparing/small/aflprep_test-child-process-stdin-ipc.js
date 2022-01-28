'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
if (process.argv[2] === 'child') {
  return;
}
const proc = spawn(process.execPath, [__filename, 'child'], {
  stdio: ['ipc', 'inherit', 'inherit']
});
proc.on('exit', common.mustCall(function(code) {
  assert.strictEqual(code, 0);
}));
