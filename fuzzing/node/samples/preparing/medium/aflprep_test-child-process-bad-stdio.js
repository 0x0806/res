'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  setTimeout(() => {}, common.platformTimeout(100));
  return;
}
const original = ChildProcess.prototype.spawn;
ChildProcess.prototype.spawn = function() {
  const err = original.apply(this, arguments);
  this.stdout.destroy();
  this.stderr.destroy();
  this.stdout = null;
  this.stderr = null;
  return err;
};
function createChild(options, callback) {
  const cmd = `"${process.execPath}" "${__filename}" child`;
  return cp.exec(cmd, options, common.mustCall(callback));
}
{
  createChild({}, (err, stdout, stderr) => {
    assert.strictEqual(err, null);
    assert.strictEqual(stdout, '');
    assert.strictEqual(stderr, '');
  });
}
{
  const error = new Error('foo');
  const child = createChild({}, (err, stdout, stderr) => {
    assert.strictEqual(err, error);
    assert.strictEqual(stdout, '');
    assert.strictEqual(stderr, '');
  });
  child.emit('error', error);
}
{
  createChild({ timeout: 1 }, (err, stdout, stderr) => {
    assert.strictEqual(err.killed, true);
    assert.strictEqual(stdout, '');
    assert.strictEqual(stderr, '');
  });
}
