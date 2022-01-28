'use strict';
const assert = require('assert');
const m = require('module');
global.mwc = 0;
m.wrapper[0] += 'global.mwc = (global.mwc || 0 ) + 1;';
assert.strictEqual(mwc, 1);
delete global.mwc;
