'use strict';
const assert = require('assert');
const dns = require('dns');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different async IDs');
const hooks = initHooks();
hooks.enable();
dns.lookup('www.google.com', 4, common.mustCall(onlookup));
function onlookup() {
  const as = hooks.activitiesOfTypes('GETADDRINFOREQWRAP');
  assert.strictEqual(as.length, 1);
  const a = as[0];
  assert.strictEqual(a.type, 'GETADDRINFOREQWRAP');
  assert.strictEqual(typeof a.uid, 'number');
  assert.strictEqual(a.triggerAsyncId, 1);
  checkInvocations(a, { init: 1, before: 1 }, 'while in onlookup callback');
  tick(2);
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('GETADDRINFOREQWRAP');
  const as = hooks.activitiesOfTypes('GETADDRINFOREQWRAP');
  const a = as[0];
  checkInvocations(a, { init: 1, before: 1, after: 1, destroy: 1 },
                   'when process exits');
}
