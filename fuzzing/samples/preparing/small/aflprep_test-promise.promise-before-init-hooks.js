'use strict';
const assert = require('assert');
const p = new Promise(common.mustCall(function executor(resolve) {
  resolve(5);
}));
const hooks = initHooks({ allowNoInit: true });
hooks.enable();
p.then(function afterResolution(val) {
  assert.strictEqual(val, 5);
  const as = hooks.activitiesOfTypes('PROMISE');
  assert.strictEqual(as.length, 1);
  checkInvocations(as[0], { init: 1, before: 1 },
                   'after resolution child promise');
  return val;
});
process.on('exit', function onexit() {
  hooks.disable();
  hooks.sanityCheck('PROMISE');
  const as = hooks.activitiesOfTypes('PROMISE');
  assert.strictEqual(as.length, 1);
  const a0 = as[0];
  assert.strictEqual(a0.type, 'PROMISE');
  assert.strictEqual(typeof a0.uid, 'number');
  assert.strictEqual(a0.triggerAsyncId, a0.uid - 1);
  checkInvocations(a0, { init: 1, before: 1, after: 1 }, 'when process exits');
});
