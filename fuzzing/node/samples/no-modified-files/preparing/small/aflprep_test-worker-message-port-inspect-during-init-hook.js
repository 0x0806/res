'use strict';
const util = require('util');
const assert = require('assert');
const async_hooks = require('async_hooks');
const { MessageChannel } = require('worker_threads');
async_hooks.createHook({
  init: common.mustCall((id, type, triggerId, resource) => {
    assert.strictEqual(
      util.inspect(resource),
      'MessagePort [EventTarget] { active: true, refed: false }');
  }, 2)
}).enable();
const { port1 } = new MessageChannel();
const inspection = util.inspect(port1);
assert(inspection.includes('active: true'));
assert(inspection.includes('refed: false'));
