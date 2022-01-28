'use strict';
const assert = require('assert');
const vm = require('vm');
let sandbox = {};
vm.runInNewContext('this.Proxy = Proxy', sandbox);
assert.strictEqual(typeof sandbox.Proxy, 'function');
assert.notStrictEqual(sandbox.Proxy, Proxy);
sandbox = { Proxy };
vm.runInNewContext('this.Proxy = Proxy', sandbox);
assert.strictEqual(typeof sandbox.Proxy, 'function');
assert.strictEqual(sandbox.Proxy, Proxy);
