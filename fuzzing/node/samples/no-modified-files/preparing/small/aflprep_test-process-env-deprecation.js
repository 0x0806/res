'use strict';
const assert = require('assert');
common.expectWarning(
  'DeprecationWarning',
  'Assigning any value other than a string, number, or boolean to a ' +
  'process.env property is deprecated. Please make sure to convert the value ' +
  'to a string before setting process.env with it.',
  'DEP0104'
);
process.env.FOO = 'apple';
process.env.ABC = undefined;
assert.strictEqual(process.env.ABC, 'undefined');
