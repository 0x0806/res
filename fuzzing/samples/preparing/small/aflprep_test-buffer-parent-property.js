'use strict';
const assert = require('assert');
assert((new Buffer(0)).parent instanceof ArrayBuffer);
assert((new Buffer(Buffer.poolSize)).parent instanceof ArrayBuffer);
const arrayBuffer = new ArrayBuffer(0);
assert.strictEqual(new Buffer(arrayBuffer).parent, arrayBuffer);
assert.strictEqual(new Buffer(arrayBuffer).buffer, arrayBuffer);
assert.strictEqual(Buffer.from(arrayBuffer).parent, arrayBuffer);
assert.strictEqual(Buffer.from(arrayBuffer).buffer, arrayBuffer);
