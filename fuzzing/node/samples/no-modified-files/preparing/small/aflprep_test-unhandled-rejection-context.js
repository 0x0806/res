'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
if (!common.isMainThread)
  common.skip('Worker bootstrapping works differently -> different async IDs');
const promiseAsyncIds = [];
const hooks = initHooks({
  oninit(asyncId, type) {
    if (type === 'PROMISE') {
      promiseAsyncIds.push(asyncId);
    }
  }
});
hooks.enable();
Promise.reject();
process.on('unhandledRejection', common.mustCall(() => {
  assert.strictEqual(promiseAsyncIds.length, 1);
  assert.strictEqual(async_hooks.executionAsyncId(), promiseAsyncIds[0]);
}));
