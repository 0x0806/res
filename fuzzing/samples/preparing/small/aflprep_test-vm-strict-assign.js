'use strict';
const assert = require('assert');
const vm = require('vm');
const ctx = vm.createContext();
vm.runInContext('Object.defineProperty(this, "x", { value: 42 })', ctx);
assert.strictEqual(ctx.x, 42);
assert.strictEqual(vm.runInContext('x', ctx), 42);
assert.throws(() => vm.runInContext('"use strict"; x = 0', ctx),
assert.strictEqual(vm.runInContext('x', ctx), 42);
