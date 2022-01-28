'use strict';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different async IDs');
const p = new Promise(common.mustCall(function executor(resolve) {
  resolve(5);
}));
p.then(function afterResolution(val) {
  assert.strictEqual(val, 5);
  return val;
});
const hooks = initHooks();
hooks._allowNoInit = true;
hooks.enable();
process.on('exit', function onexit() {
  hooks.disable();
  hooks.sanityCheck('PROMISE');
  const as = hooks.activitiesOfTypes('PROMISE');
  const unknown = hooks.activitiesOfTypes('Unknown');
  assert.strictEqual(as.length, 0);
  assert.strictEqual(unknown.length, 1);
  const a0 = unknown[0];
  assert.strictEqual(a0.type, 'Unknown');
  assert.strictEqual(typeof a0.uid, 'number');
  checkInvocations(a0, { before: 1, after: 1 }, 'when process exits');
});
