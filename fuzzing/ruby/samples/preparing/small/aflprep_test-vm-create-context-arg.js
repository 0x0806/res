'use strict';
const assert = require('assert');
const vm = require('vm');
assert.throws(() => {
  vm.createContext('string is not supported');
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
vm.createContext({ a: 1 });
vm.createContext([0, 1, 2, 3]);
const sandbox = {};
vm.createContext(sandbox);
vm.createContext(sandbox);
