'use strict';
const assert = require('assert');
const vm = require('vm');
const handler = {
  getOwnPropertyDescriptor: common.mustCallAtLeast(() => {
    return {};
  })
};
const proxy = new Proxy({}, handler);
assert.throws(() => vm.runInNewContext('p = 6', proxy),
