'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
function recurse(n) {
  const a = new async_hooks.AsyncResource('foobar');
  a.runInAsyncScope(() => {
    assert.strictEqual(a.asyncId(), async_hooks.executionAsyncId());
    assert.strictEqual(a.triggerAsyncId(), async_hooks.triggerAsyncId());
    if (n >= 0)
      recurse(n - 1);
    assert.strictEqual(a.asyncId(), async_hooks.executionAsyncId());
    assert.strictEqual(a.triggerAsyncId(), async_hooks.triggerAsyncId());
  });
}
recurse(1000);
