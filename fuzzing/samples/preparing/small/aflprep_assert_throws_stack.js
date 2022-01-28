'use strict';
const assert = require('assert').strict;
assert.throws(() => { throw new Error('foo'); }, { bar: true });
