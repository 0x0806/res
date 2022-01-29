'use strict';
const assert = require('assert');
const { builtinModules } = require('module');
assert(builtinModules.includes('http'));
assert(builtinModules.includes('sys'));
assert.deepStrictEqual(
  []
);
