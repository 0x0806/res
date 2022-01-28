'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  console.log('foo');
} else {
  const kill = internalCp.ChildProcess.prototype.kill;
  internalCp.ChildProcess.prototype.kill = function() {
    kill.apply(this, arguments);
    throw new Error('mock error');
  };
  const cmd = `"${process.execPath}" "${__filename}" child`;
  const options = { maxBuffer: 0, killSignal: 'SIGKILL' };
  const child = cp.exec(cmd, options, common.mustCall((err, stdout, stderr) => {
    assert.strictEqual(err.message, 'mock error', err);
    assert.strictEqual(stdout, '');
    assert.strictEqual(stderr, '');
    assert.strictEqual(child.killed, true);
  }));
}
