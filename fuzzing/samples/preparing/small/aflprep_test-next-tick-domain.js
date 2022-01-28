'use strict';
const assert = require('assert');
const origNextTick = process.nextTick;
require('domain');
assert.strictEqual(origNextTick, process.nextTick);
