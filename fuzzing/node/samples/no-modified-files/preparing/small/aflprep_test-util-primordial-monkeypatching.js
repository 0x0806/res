'use strict';
const assert = require('assert');
const util = require('util');
Object.keys = () => { throw new Error('fhqwhgads'); };
assert.strictEqual(util.inspect({}), '{}');
