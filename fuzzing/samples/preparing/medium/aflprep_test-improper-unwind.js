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
  const eventOneId = newAsyncId();
  const eventTwoId = newAsyncId();
  const triggerId = getDefaultTriggerAsyncId();
  emitInit(eventOneId, 'event1', triggerId, {});
  emitInit(eventTwoId, 'event2', triggerId, {});
  emitBefore(eventOneId, triggerId);
  emitBefore(eventTwoId, triggerId);
  emitAfter(eventTwoId);
  emitAfter(eventOneId);
  emitBefore(eventOneId, triggerId);
  emitBefore(eventTwoId, triggerId);
  console.log('heartbeat: still alive');
  emitAfter(eventOneId);
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
