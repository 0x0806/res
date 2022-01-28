'use strict';
const assert = require('assert');
const testCase = '(41.92 + 0.08);';
const expected = 42;
const actual = addon.testNapiRun(testCase);
assert.strictEqual(actual, expected);
