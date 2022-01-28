'use strict';
const assert = require('assert');
const net = require('net');
const spawn = require('child_process').spawn;
if (process.argv[2] === 'worker')
  worker();
else
  primary();
function primary() {
  const proc = spawn(process.execPath, [
    '--expose-internals', __filename, 'worker',
  ], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc']
  });
  let handle = null;
  proc.on('exit', () => {
    handle.close();
  });
  proc.stdout.on('data', common.mustCall((data) => {
    assert.strictEqual(data.toString(), 'ok\r\n');
    net.createServer(common.mustNotCall()).listen(0, function() {
      handle = this._handle;
      proc.send('one');
      proc.send('two', handle);
      proc.send('three');
      proc.stdin.write('ok\r\n');
    });
  }));
  proc.stderr.pipe(process.stderr);
}
function worker() {
  process.stdout.ref();
  process.stdout.write('ok\r\n');
  process.stdin.once('data', common.mustCall((data) => {
    assert.strictEqual(data.toString(), 'ok\r\n');
    process[kChannelHandle].readStart();
  }));
  let n = 0;
  process.on('message', common.mustCall((msg, handle) => {
    n += 1;
    if (n === 1) {
      assert.strictEqual(msg, 'one');
      assert.strictEqual(handle, undefined);
    } else if (n === 2) {
      assert.strictEqual(msg, 'two');
      assert.ok(handle !== null && typeof handle === 'object');
      handle.close();
    } else if (n === 3) {
      assert.strictEqual(msg, 'three');
      assert.strictEqual(handle, undefined);
      process.exit();
    }
  }, 3));
}
