'use strict';
const vm = require('vm');
const assert = require('assert');
let base = {
  propBase: 1
};
let sandbox = Object.create(base, {
  propSandbox: { value: 3 }
});
const context = vm.createContext(sandbox);
let result = vm.runInContext('Object.hasOwnProperty(this, "propBase");',
                             context);
assert.strictEqual(result, false);
base = Object.create(null);
base.x = 1;
base.y = 2;
sandbox = Object.create(base);
sandbox.z = 3;
assert.deepStrictEqual(Object.keys(sandbox), ['z']);
const code = 'x = 0; z = 4;';
result = vm.runInNewContext(code, sandbox);
assert.strictEqual(result, 4);
assert.deepStrictEqual(Object.keys(sandbox), ['z', 'x']);
