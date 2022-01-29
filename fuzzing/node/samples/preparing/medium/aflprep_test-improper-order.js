'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const {
  newAsyncId, getDefaultTriggerAsyncId,
  emitInit, emitBefore, emitAfter
} = internal_async_hooks;
if (process.argv[2] === 'child') {
  const hooks = initHooks();
  hooks.enable();
  {
    const asyncId = newAsyncId();
    const triggerId = getDefaultTriggerAsyncId();
    emitInit(asyncId, 'event1', triggerId, {});
    emitBefore(asyncId, triggerId);
    emitAfter(asyncId);
  }
  {
    const asyncId = newAsyncId();
    const triggerId = getDefaultTriggerAsyncId();
    emitInit(asyncId, 'event2', triggerId, {});
    console.log('heartbeat: still alive');
    emitAfter(asyncId);
  }
} else {
  const args = ['--expose-internals']
    .concat(process.argv.slice(1))
    .concat('child');
  let errData = Buffer.from('');
  let outData = Buffer.from('');
  const child = spawn(process.execPath, args);
  child.stderr.on('data', (d) => { errData = Buffer.concat([ errData, d ]); });
  child.stdout.on('data', (d) => { outData = Buffer.concat([ outData, d ]); });
  child.on('close', common.mustCall((code) => {
    assert.strictEqual(code, 1);
    assert.match(outData.toString(), heartbeatMsg,
                 'did not crash until we reached offending line of code ' +
                 `(found ${outData})`);
    assert.match(errData.toString(), corruptedMsg,
                 'printed error contains corrupted message ' +
                 `(found ${errData})`);
  }));
}
