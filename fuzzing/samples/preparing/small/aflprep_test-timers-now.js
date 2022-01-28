'use strict';
const assert = require('assert');
const { getLibuvNow } = internalBinding('timers');
assert(getLibuvNow() < 0x3ffffff);
