'use strict';
const assert = require('assert');
const fs = require('fs');
const hooks = initHooks();
hooks.enable();
fs.access(__filename, common.mustCall(onaccess));
function onaccess() {
  const as = hooks.activitiesOfTypes('FSREQCALLBACK');
  const a = as[0];
  checkInvocations(a, { init: 1, before: 1 },
                   'while in onaccess callback');
  tick(2);
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('FSREQCALLBACK');
  const as = hooks.activitiesOfTypes('FSREQCALLBACK');
  assert.strictEqual(as.length, 1);
  const a = as[0];
  assert.strictEqual(a.type, 'FSREQCALLBACK');
  assert.strictEqual(typeof a.uid, 'number');
  checkInvocations(a, { init: 1, before: 1, after: 1, destroy: 1 },
                   'when process exits');
}
