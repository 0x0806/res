'use strict';
const assert = require('assert');
const vm = require('vm');
const sandbox = {};
Object.defineProperty(sandbox, 'prop', {
  get() {
    return 'foo';
  }
});
const descriptor = Object.getOwnPropertyDescriptor(sandbox, 'prop');
const context = vm.createContext(sandbox);
const code = 'Object.getOwnPropertyDescriptor(this, "prop");';
const result = vm.runInContext(code, context);
assert.deepStrictEqual(Object.keys(result), Object.keys(descriptor));
for (const prop of Object.keys(result)) {
  assert.strictEqual(result[prop], descriptor[prop]);
}
