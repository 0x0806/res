'use strict';
const assert = require('assert');
assert.strictEqual(undefined, process._internalBinding);
assert.strictEqual(undefined, process.internalBinding);
assert.throws(() => {
  process.binding('module_wrap');
