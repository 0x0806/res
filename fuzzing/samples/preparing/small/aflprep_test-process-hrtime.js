'use strict';
const assert = require('assert');
const start = process.hrtime();
assert(Array.isArray(start));
const now = Date.now();
while (Date.now() - now < 2000);
const diff = process.hrtime(start);
assert(diff[0] >= 1);
assert(diff[0] <= 2);
