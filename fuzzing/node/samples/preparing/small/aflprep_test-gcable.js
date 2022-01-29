'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const hook_result = {
  id: null,
  init_called: false,
  destroy_called: false,
};
const test_hook = async_hooks.createHook({
  init: (id, type) => {
    if (type === 'test_async') {
      hook_result.id = id;
      hook_result.init_called = true;
    }
  },
  destroy: (id) => {
    if (id === hook_result.id) hook_result.destroy_called = true;
  },
});
test_hook.enable();
createAsyncResource({});
const arr = new Array(1024 * 1024);
for (let i = 0; i < arr.length; i++)
  arr[i] = {};
assert.strictEqual(hook_result.destroy_called, false);
setImmediate(() => {
  assert.strictEqual(hook_result.destroy_called, true);
});
