'use strict';
if (common.isWindows)
  common.skip('Win32 does not support signals.');
const assert = require('assert');
const spawn = require('child_process').spawn;
if (process.argv[2] !== '--do-test') {
  process.env.DOTEST = 'y';
  const child = spawn(process.execPath, [__filename, '--do-test']);
  child.once('exit', common.mustCall(function(code, signal) {
    assert.strictEqual(signal, 'SIGINT');
  }));
  return;
}
process.on('SIGINT', function() {
  process.removeAllListeners('SIGINT');
  process.kill(process.pid, 'SIGINT');
});
process.stdin.resume();
process.kill(process.pid, 'SIGINT');
