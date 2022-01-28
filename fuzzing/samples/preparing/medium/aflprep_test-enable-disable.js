'use strict';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different timing');
const types = [ 'Immediate', 'Unknown' ];
const hook1 = initHooks();
const hook2 = initHooks({ onbefore: onhook2Before, allowNoInit: true });
const hook3 = initHooks({ onbefore: onhook3Before, onafter: onhook3After });
hook1.enable();
hook1.enable();
hook3.enable();
let enabledHook2 = false;
function onhook3Before() {
  if (enabledHook2) return;
  hook2.enable();
  enabledHook2 = true;
}
let disabledHook3 = false;
function onhook2Before() {
  if (disabledHook3) return;
  hook1.disable();
  hook1.disable();
  disabledHook3 = true;
}
let count = 2;
function onhook3After() {
  if (!--count) {
    hook3.disable();
  }
}
setImmediate(common.mustCall(onfirstImmediate));
function onfirstImmediate() {
  const as1 = hook1.activitiesOfTypes(types);
  const as2 = hook2.activitiesOfTypes(types);
  const as3 = hook3.activitiesOfTypes(types);
  assert.strictEqual(as1.length, 1);
  assert.strictEqual(as2.length, 0);
  assert.strictEqual(as3.length, 1);
  const firstImmediate = as1[0];
  assert.strictEqual(as3[0].uid, as1[0].uid);
  assert.strictEqual(firstImmediate.type, 'Immediate');
  assert.strictEqual(typeof firstImmediate.uid, 'number');
  assert.strictEqual(typeof firstImmediate.triggerAsyncId, 'number');
  checkInvocations(as1[0], { init: 1, before: 1 },
                   'hook1[0]: on first immediate');
  checkInvocations(as3[0], { init: 1, before: 1 },
                   'hook3[0]: on first immediate');
  setImmediate(common.mustCall(onsecondImmediate));
}
let hook1First, hook2First, hook3First;
let hook1Second, hook2Second, hook3Second;
function onsecondImmediate() {
  const as1 = hook1.activitiesOfTypes(types);
  const as2 = hook2.activitiesOfTypes(types);
  const as3 = hook3.activitiesOfTypes(types);
  assert.strictEqual(as1.length, 2);
  assert.strictEqual(as2.length, 2);
  assert.strictEqual(as3.length, 2);
  hook1First = as1[0];
  hook1Second = as1[1];
  hook2First = as2[1];
  hook2Second = as2[0];
  hook3First = as3[0];
  hook3Second = as3[1];
  const secondImmediate = hook1Second;
  assert.strictEqual(hook2Second.uid, hook3Second.uid);
  assert.strictEqual(hook1Second.uid, hook3Second.uid);
  assert.strictEqual(secondImmediate.type, 'Immediate');
  assert.strictEqual(typeof secondImmediate.uid, 'number');
  assert.strictEqual(typeof secondImmediate.triggerAsyncId, 'number');
  checkInvocations(hook1First, { init: 1, before: 1, after: 1, destroy: 1 },
                   'hook1First: on second immediate');
  checkInvocations(hook1Second, { init: 1, before: 1 },
                   'hook1Second: on second immediate');
  checkInvocations(hook2First, { after: 1, destroy: 1 },
                   'hook2First: on second immediate');
  checkInvocations(hook2Second, { init: 1, before: 1 },
                   'hook2Second: on second immediate');
  checkInvocations(hook3First, { init: 1, before: 1, after: 1, destroy: 1 },
                   'hook3First: on second immediate');
  checkInvocations(hook3Second, { init: 1, before: 1 },
                   'hook3Second: on second immediate');
  tick(1);
}
process.on('exit', onexit);
function onexit() {
  hook1.disable();
  hook2.disable();
  hook3.disable();
  hook1.sanityCheck();
  hook2.sanityCheck();
  hook3.sanityCheck();
  checkInvocations(hook1First, { init: 1, before: 1, after: 1, destroy: 1 },
                   'hook1First: when process exits');
  checkInvocations(hook1Second, { init: 1, before: 1 },
                   'hook1Second: when process exits');
  checkInvocations(hook2First, { after: 1, destroy: 1 },
                   'hook2First: when process exits');
  checkInvocations(hook2Second, { init: 1, before: 1, after: 1, destroy: 1 },
                   'hook2Second: when process exits');
  checkInvocations(hook3First, { init: 1, before: 1, after: 1, destroy: 1 },
                   'hook3First: when process exits');
  checkInvocations(hook3Second, { init: 1, before: 1, after: 1 },
                   'hook3Second: when process exits');
}
