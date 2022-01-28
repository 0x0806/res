'use strict';
const { Readable } = require('stream');
const assert = require('assert');
{
  assert(Readable.prototype.hasOwnProperty('readableEnded'));
}
{
  const readable = new Readable();
  readable._read = () => {
    assert.strictEqual(readable.readableEnded, false);
    readable.push('asd');
    assert.strictEqual(readable.readableEnded, false);
    readable.push(null);
    assert.strictEqual(readable.readableEnded, false);
  };
  readable.on('end', common.mustCall(() => {
    assert.strictEqual(readable.readableEnded, true);
  }));
  readable.on('data', common.mustCall(() => {
    assert.strictEqual(readable.readableEnded, false);
  }));
}
{
  const readable = new Readable();
  readable.on('readable', () => { readable.read(); });
  readable.on('error', common.mustNotCall());
  readable.on('end', common.mustCall());
  readable.push('a');
  readable.push(null);
  readable.push(null);
}
