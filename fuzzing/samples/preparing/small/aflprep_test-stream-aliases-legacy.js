'use strict';
const assert = require('assert');
const stream = require('stream');
assert.strictEqual(stream.Readable, require('_stream_readable'));
assert.strictEqual(stream.Writable, require('_stream_writable'));
assert.strictEqual(stream.Duplex, require('_stream_duplex'));
assert.strictEqual(stream.Transform, require('_stream_transform'));
assert.strictEqual(stream.PassThrough, require('_stream_passthrough'));
