'use strict';
const net = require('net');
const assert = require('assert');
const { fork } = require('child_process');
if (process.argv[2] !== 'child') {
  tmpdir.refresh();
  const child = fork(__filename, ['child'], { stdio: 'inherit' });
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
  }));
  return;
}
const s = net.Server();
s.listen(common.PIPE);
s.unref();
