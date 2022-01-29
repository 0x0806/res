'use strict';
const assert = require('assert');
const { ReadStream, WriteStream } = require('tty');
{
  const stream = ReadStream(0);
  stream.unref();
  assert(stream instanceof ReadStream);
  assert.strictEqual(stream.isTTY, true);
}
{
  const stream = WriteStream(1);
  assert(stream instanceof WriteStream);
  assert.strictEqual(stream.isTTY, true);
}
