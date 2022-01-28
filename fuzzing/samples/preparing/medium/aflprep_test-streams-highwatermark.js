'use strict';
const assert = require('assert');
const stream = require('stream');
const { inspect } = require('util');
{
  const ovfl = Number.MAX_SAFE_INTEGER;
  const readable = stream.Readable({ highWaterMark: ovfl });
  assert.strictEqual(readable._readableState.highWaterMark, ovfl);
  const writable = stream.Writable({ highWaterMark: ovfl });
  assert.strictEqual(writable._writableState.highWaterMark, ovfl);
  for (const invalidHwm of [true, false, '5', {}, -5, NaN]) {
    for (const type of [stream.Readable, stream.Writable]) {
      assert.throws(() => {
        type({ highWaterMark: invalidHwm });
      }, {
        name: 'TypeError',
        code: 'ERR_INVALID_ARG_VALUE',
        message: "The property 'options.highWaterMark' is invalid. " +
          `Received ${inspect(invalidHwm)}`
      });
    }
  }
}
{
  const readable = stream.Readable({ highWaterMark: 0 });
  for (let i = 0; i < 3; i++) {
    const needMoreData = readable.push();
    assert.strictEqual(needMoreData, true);
  }
}
{
  const readable = stream.Readable({ highWaterMark: 0 });
  readable._read = common.mustCall();
  readable.read(0);
}
{
  ['1', '1.0', 1].forEach((size) => {
    const readable = new stream.Readable({
      read: common.mustCall(),
      highWaterMark: 0,
    });
    readable.read(size);
    assert.strictEqual(readable._readableState.highWaterMark, Number(size));
  });
}
