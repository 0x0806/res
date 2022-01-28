'use strict';
const assert = require('assert');
const repl = require('repl');
require.cache.something = 1;
assert.strictEqual(require.cache.something, 1);
repl.start({ useGlobal: false }).close();
assert.strictEqual(require.cache.something, 1);
