'use strict';
if (common.isWindows)
  common.skip('no signals in Windows');
if (!common.isMainThread)
  common.skip('No signal handling available in Workers');
const assert = require('assert');
const exec = require('child_process').exec;
const hooks = initHooks();
hooks.enable();
const interval = setInterval(() => {}, 9999);
process.on('SIGUSR2', common.mustCall(onsigusr2, 2));
const as = hooks.activitiesOfTypes('SIGNALWRAP');
assert.strictEqual(as.length, 1);
const signal1 = as[0];
assert.strictEqual(signal1.type, 'SIGNALWRAP');
assert.strictEqual(typeof signal1.uid, 'number');
assert.strictEqual(typeof signal1.triggerAsyncId, 'number');
checkInvocations(signal1, { init: 1 }, 'when SIGUSR2 handler is set up');
let count = 0;
exec(`kill -USR2 ${process.pid}`);
let signal2;
function onsigusr2() {
  count++;
  if (count === 1) {
    checkInvocations(
      signal1, { init: 1, before: 1 },
      ' signal1: when first SIGUSR2 handler is called for the first time');
    exec(`kill -USR2 ${process.pid}`);
  } else {
    checkInvocations(
      signal1, { init: 1, before: 2, after: 1 },
      'signal1: when first SIGUSR2 handler is called for the second time');
    process.removeAllListeners('SIGUSR2');
    process.on('SIGUSR2', common.mustCall(onsigusr2Again));
    const as = hooks.activitiesOfTypes('SIGNALWRAP');
    const expectedLen = 2 + (!!process.stdout.isTTY || !!process.stderr.isTTY);
    assert.strictEqual(as.length, expectedLen);
    assert.strictEqual(signal2.type, 'SIGNALWRAP');
    assert.strictEqual(typeof signal2.uid, 'number');
    assert.strictEqual(typeof signal2.triggerAsyncId, 'number');
    checkInvocations(
      signal1, { init: 1, before: 2, after: 1 },
      'signal1: when second SIGUSR2 handler is set up');
    checkInvocations(
      signal2, { init: 1 },
      'signal2: when second SIGUSR2 handler is setup');
    exec(`kill -USR2 ${process.pid}`);
  }
}
function onsigusr2Again() {
  clearInterval(interval);
  setImmediate(() => {
    checkInvocations(
      signal1, { init: 1, before: 2, after: 2, destroy: 1 },
      'signal1: when second SIGUSR2 handler is called');
    checkInvocations(
      signal2, { init: 1, before: 1 },
      'signal2: when second SIGUSR2 handler is called');
  });
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('SIGNALWRAP');
  checkInvocations(
    signal1, { init: 1, before: 2, after: 2, destroy: 1 },
    'signal1: when second SIGUSR2 process exits');
  checkInvocations(
    signal2, { init: 1, before: 1, after: 1 },
    'signal2: when second SIGUSR2 process exits');
}
