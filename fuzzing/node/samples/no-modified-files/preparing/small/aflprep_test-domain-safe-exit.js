'use strict';
const assert = require('assert');
const domain = require('domain');
const util = require('util');
const a = domain.create();
const b = domain.create();
assert.deepStrictEqual(domain._stack, [a, b], 'Unexpected stack shape ' +
                       `(domain._stack = ${util.inspect(domain._stack)})`);
assert.deepStrictEqual(domain._stack, [a, b], 'Unexpected stack shape ' +
                       `(domain._stack = ${util.inspect(domain._stack)})`);
