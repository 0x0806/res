'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
let initialAsyncId;
const promise = new Promise((resolve) => {
  setTimeout(() => {
    initialAsyncId = async_hooks.executionAsyncId();
    async_hooks.createHook({
      after: common.mustCall(() => {}, 2)
    }).enable();
    resolve();
  }, 0);
});
promise.then(common.mustCall(() => {
  const id = async_hooks.executionAsyncId();
  assert.notStrictEqual(id, initialAsyncId);
  assert.ok(id > 0);
}));
