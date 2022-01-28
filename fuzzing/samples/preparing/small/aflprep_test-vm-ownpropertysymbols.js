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
const nativeSym = vm.runInNewContext('Object.getOwnPropertySymbols(this);');
const ownSym = vm.runInContext('Object.getOwnPropertySymbols(this);', ctx);
const restSym = ownSym.filter((sym) => !nativeSym.includes(sym));
assert.deepStrictEqual(Array.from(restSym), [sym1, sym2]);
