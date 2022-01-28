'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  setInterval(() => {}, 1000);
} else {
  const oldSpawnSync = internalCp.spawnSync;
  const { SIGKILL } = require('os').constants.signals;
  function spawn(killSignal, beforeSpawn) {
    if (beforeSpawn) {
      internalCp.spawnSync = common.mustCall(function(opts) {
        beforeSpawn(opts);
        return oldSpawnSync(opts);
      });
    }
    const child = cp.spawnSync(process.execPath,
                               [__filename, 'child'],
                               { killSignal, timeout: 100 });
    if (beforeSpawn)
      internalCp.spawnSync = oldSpawnSync;
    assert.strictEqual(child.status, null);
    assert.strictEqual(child.error.code, 'ETIMEDOUT');
    return child;
  }
  assert.throws(() => {
    spawn('SIG_NOT_A_REAL_SIGNAL');
  }, { code: 'ERR_UNKNOWN_SIGNAL', name: 'TypeError' });
  {
    const child = spawn(undefined, (opts) => {
      assert.strictEqual(opts.killSignal, undefined);
    });
    assert.strictEqual(child.signal, 'SIGTERM');
  }
  {
    const child = spawn('SIGKILL', (opts) => {
      assert.strictEqual(opts.killSignal, SIGKILL);
    });
    assert.strictEqual(child.signal, 'SIGKILL');
  }
  {
    assert.strictEqual(typeof SIGKILL, 'number');
    const child = spawn(SIGKILL, (opts) => {
      assert.strictEqual(opts.killSignal, SIGKILL);
    });
    assert.strictEqual(child.signal, 'SIGKILL');
  }
}
