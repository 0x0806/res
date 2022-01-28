'use strict';
const assert = require('assert');
const { performance } = require('perf_hooks');
const check = runInNewContext(`
const { performance, assert } = data;
const timerified = performance.timerify(function() { return []; });
assert.strictEqual(timerified().constructor, Array);
'success';
`, { performance, assert });
assert.strictEqual(check, 'success');
