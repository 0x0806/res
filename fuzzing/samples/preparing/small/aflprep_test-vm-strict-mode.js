'use strict';
const assert = require('assert');
const vm = require('vm');
const ctx = vm.createContext({ x: 42 });
vm.runInContext('"use strict"; x = 1', ctx);
assert.strictEqual(ctx.x, 1);
