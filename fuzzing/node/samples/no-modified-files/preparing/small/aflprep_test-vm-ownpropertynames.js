'use strict';
const vm = require('vm');
const assert = require('assert');
const sym1 = Symbol('1');
const sym2 = Symbol('2');
const sandbox = {
  a: true,
  [sym1]: true
};
Object.defineProperty(sandbox, 'b', { value: true });
Object.defineProperty(sandbox, sym2, { value: true });
const ctx = vm.createContext(sandbox);
const nativeNames = vm.runInNewContext('Object.getOwnPropertyNames(this);');
const ownNames = vm.runInContext('Object.getOwnPropertyNames(this);', ctx);
const restNames = ownNames.filter((name) => !nativeNames.includes(name));
assert.deepStrictEqual(Array.from(restNames), ['a', 'b']);
