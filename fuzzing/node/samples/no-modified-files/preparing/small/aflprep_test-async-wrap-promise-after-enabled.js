'use strict';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different timing');
const async_hooks = require('async_hooks');
const seenEvents = [];
const p = new Promise((resolve) => resolve(1));
p.then(() => seenEvents.push('then'));
const hooks = async_hooks.createHook({
  init: common.mustNotCall(),
  before: common.mustCall((id) => {
    assert.ok(id > 1);
    seenEvents.push('before');
  }),
  after: common.mustCall((id) => {
    assert.ok(id > 1);
    seenEvents.push('after');
    hooks.disable();
  })
});
setImmediate(() => {
  assert.deepStrictEqual(seenEvents, ['before', 'then', 'after']);
});
