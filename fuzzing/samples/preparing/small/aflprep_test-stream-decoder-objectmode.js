'use strict';
const stream = require('stream');
const assert = require('assert');
const readable = new stream.Readable({
  read: () => {},
  encoding: 'utf16le',
  objectMode: true
});
readable.push(Buffer.from('abc', 'utf16le'));
readable.push(Buffer.from('def', 'utf16le'));
readable.push(null);
assert.strictEqual(readable.read(), 'abc');
assert.strictEqual(readable.read(), 'def');
assert.strictEqual(readable.read(), null);
