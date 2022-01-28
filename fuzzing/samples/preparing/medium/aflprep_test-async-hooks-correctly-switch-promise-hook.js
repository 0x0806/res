'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const layers = new Map();
async_hooks.createHook({
  init(asyncId, type) {
    layers.set(asyncId, {
      type,
      init: true,
      before: false,
      after: false,
      promiseResolve: false
    });
  },
  before(asyncId) {
    if (layers.has(asyncId)) {
      layers.get(asyncId).before = true;
    }
  },
  after(asyncId) {
    if (layers.has(asyncId)) {
      layers.get(asyncId).after = true;
    }
  },
  promiseResolve(asyncId) {
    if (layers.has(asyncId)) {
      layers.get(asyncId).promiseResolve = true;
    }
  }
}).enable();
async_hooks.createHook({
  init() { },
  destroy() { }
}).enable();
async function main() {
  return Promise.resolve();
}
main();
process.on('exit', () => {
  assert.deepStrictEqual(Array.from(layers.values()), [
    {
      type: 'PROMISE',
      init: true,
      before: true,
      after: true,
      promiseResolve: true
    },
    {
      type: 'PROMISE',
      init: true,
      before: false,
      after: false,
      promiseResolve: true
    },
    {
      type: 'PROMISE',
      init: true,
      before: true,
      after: true,
      promiseResolve: true
    },
  ]);
});
