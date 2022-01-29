'use strict';
const assert = require('assert');
const zlib = require('zlib');
const input = Buffer.from([0x78, 0xBB, 0x04, 0x09, 0x01, 0xA5]);
{
  const stream = zlib.createInflate();
  stream.on('error', common.mustCall(function(err) {
  }));
  stream.write(input);
}
{
  const stream = zlib.createInflate({ dictionary: Buffer.from('fail') });
  stream.on('error', common.mustCall(function(err) {
  }));
  stream.write(input);
}
{
  const stream = zlib.createInflateRaw({ dictionary: Buffer.from('fail') });
  stream.on('error', common.mustCall(function(err) {
  }));
  stream.write(input);
}
