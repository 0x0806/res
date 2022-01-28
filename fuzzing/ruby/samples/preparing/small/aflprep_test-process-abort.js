'use strict';
const assert = require('assert');
if (!common.isMainThread)
  common.skip('process.abort() is not available in Workers');
assert.strictEqual(process.abort.prototype, undefined);
assert.throws(() => new process.abort(), TypeError);
