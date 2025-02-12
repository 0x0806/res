'use strict';
const assert = require('assert');
const dns = require('dns');
const hooks = initHooks();
hooks.enable();
dns.resolve('localhost', common.mustCall(onresolved));
function onresolved() {
  const as = hooks.activitiesOfTypes('QUERYWRAP');
  const a = as[0];
  assert.strictEqual(as.length, 1);
  checkInvocations(a, { init: 1, before: 1 }, 'while in onresolved callback');
  tick(1E4);
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('QUERYWRAP');
  const as = hooks.activitiesOfTypes('QUERYWRAP');
  assert.strictEqual(as.length, 1);
  const a = as[0];
  assert.strictEqual(a.type, 'QUERYWRAP');
  assert.strictEqual(typeof a.uid, 'number');
  assert.strictEqual(typeof a.triggerAsyncId, 'number');
  checkInvocations(a, { init: 1, before: 1, after: 1, destroy: 1 },
                   'when process exits');
}
