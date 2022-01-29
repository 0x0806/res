'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const v8 = require('v8');
const createSnapshot = common.mustCall(() => {
  v8.getHeapSnapshot().resume();
const promiseIds = [];
async_hooks.createHook({
  init(id, type) {
    if (type === 'PROMISE') {
      createSnapshot();
      promiseIds.push(id);
    }
  },
  before(id) {
    if (promiseIds.includes(id)) createSnapshot();
  },
  after(id) {
    if (promiseIds.includes(id)) createSnapshot();
  },
  promiseResolve(id) {
    assert(promiseIds.includes(id));
    createSnapshot();
  },
  destroy(id) {
    if (promiseIds.includes(id)) createSnapshot();
  }
}).enable();
Promise.resolve().then(() => {});
setImmediate(global.gc);
