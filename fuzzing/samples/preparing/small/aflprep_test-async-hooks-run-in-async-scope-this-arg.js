'use strict';
const assert = require('assert');
const { AsyncResource } = require('async_hooks');
const thisArg = {};
const res = new AsyncResource('fhqwhgads');
function callback() {
  assert.strictEqual(this, thisArg);
}
res.runInAsyncScope(common.mustCall(callback), thisArg);
