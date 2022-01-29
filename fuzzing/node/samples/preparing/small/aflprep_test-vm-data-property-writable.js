'use strict';
const vm = require('vm');
const assert = require('assert');
const context = vm.createContext({});
let code = `
   Object.defineProperty(this, 'foo', {value: 5});
   Object.getOwnPropertyDescriptor(this, 'foo');
`;
let desc = vm.runInContext(code, context);
assert.strictEqual(desc.writable, false);
code = `
   const bar = Symbol('bar');
   Object.defineProperty(this, bar, {value: 6});
   Object.getOwnPropertyDescriptor(this, bar);
`;
desc = vm.runInContext(code, context);
assert.strictEqual(desc.value, 6);
