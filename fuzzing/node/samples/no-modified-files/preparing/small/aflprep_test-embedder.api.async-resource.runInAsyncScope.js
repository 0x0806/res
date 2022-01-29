'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const a = new async_hooks.AsyncResource('foobar');
const ret = a.runInAsyncScope(() => {
  return 1729;
});
assert.strictEqual(ret, 1729);
