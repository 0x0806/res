'use strict';
const path = require('path');
const assert = require('assert');
module.exports.test = function test(bindingDir) {
  const mod = require(path.join(bindingDir, 'binding.node'));
  assert.notStrictEqual(mod, null);
  assert.strictEqual(mod.hello(), 'world');
};
