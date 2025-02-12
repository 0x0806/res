'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const id_obj = {};
let collect = true;
const hook = async_hooks.createHook({
  before(id) { if (collect) id_obj[id] = true; },
  after(id) { delete id_obj[id]; },
}).enable();
process.once('uncaughtException', common.mustCall((er) => {
  assert.strictEqual(er.message, 'bye');
  collect = false;
}));
setImmediate(common.mustCall(() => {
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(Object.keys(id_obj).length, 0);
    hook.disable();
  }));
  const ar1 = new async_hooks.AsyncResource('Mine');
  ar1.runInAsyncScope(() => {
    const ar2 = new async_hooks.AsyncResource('Mine');
    ar2.runInAsyncScope(() => {
      throw new Error('bye');
    });
  });
}));
