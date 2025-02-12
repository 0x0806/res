'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
let µtaskId;
const events = [];
async_hooks.createHook({
  init(id, type, triggerId, resoure) {
    if (type === 'Microtask') {
      µtaskId = id;
      events.push('init');
    }
  },
  before(id) {
    if (id === µtaskId) events.push('before');
  },
  after(id) {
    if (id === µtaskId) events.push('after');
  },
  destroy(id) {
    if (id === µtaskId) events.push('destroy');
  }
}).enable();
queueMicrotask(() => { throw new Error(); });
process.on('uncaughtException', common.mustCall());
process.on('exit', () => {
  assert.deepStrictEqual(events, ['init', 'after', 'before', 'destroy']);
});
