'use strict';
const Stream = require('stream').Stream;
const assert = require('assert');
const sourceStream = new Stream();
const destStream = new Stream();
const result = sourceStream.pipe(destStream);
assert.strictEqual(result, destStream);
