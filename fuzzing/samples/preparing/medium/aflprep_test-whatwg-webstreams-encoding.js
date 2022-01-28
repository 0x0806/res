'use strict';
const assert = require('assert');
const {
  TextEncoderStream,
  TextDecoderStream,
const kEuroBytes = Buffer.from([0xe2, 0x82, 0xac]);
const kEuro = Buffer.from([0xe2, 0x82, 0xac]).toString();
[1, false, [], {}, 'hello'].forEach((i) => {
  assert.throws(() => new TextDecoderStream(i), {
    code: 'ERR_ENCODING_NOT_SUPPORTED',
  });
});
[1, false, 'hello'].forEach((i) => {
  assert.throws(() => new TextDecoderStream(undefined, i), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
});
{
  const tds = new TextDecoderStream();
  const writer = tds.writable.getWriter();
  const reader = tds.readable.getReader();
  reader.read().then(common.mustCall(({ value, done }) => {
    assert(!done);
    assert.strictEqual(kEuro, value);
    reader.read().then(common.mustCall(({ done }) => {
      assert(done);
    }));
  }));
  Promise.all([
    writer.write(kEuroBytes.slice(0, 1)),
    writer.write(kEuroBytes.slice(1, 2)),
    writer.write(kEuroBytes.slice(2, 3)),
    writer.close(),
  ]).then(common.mustCall());
  assert.strictEqual(tds.encoding, 'utf-8');
  assert.strictEqual(tds.fatal, false);
  assert.strictEqual(tds.ignoreBOM, false);
  assert.throws(
    () => Reflect.get(TextDecoderStream.prototype, 'encoding', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextDecoderStream.prototype, 'fatal', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextDecoderStream.prototype, 'ignoreBOM', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextDecoderStream.prototype, 'readable', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextDecoderStream.prototype, 'writable', {}), {
      code: 'ERR_INVALID_THIS',
    });
}
{
  const tds = new TextEncoderStream();
  const writer = tds.writable.getWriter();
  const reader = tds.readable.getReader();
  reader.read().then(common.mustCall(({ value, done }) => {
    assert(!done);
    const buf = Buffer.from(value.buffer, value.byteOffset, value.byteLength);
    assert.deepStrictEqual(kEuroBytes, buf);
    reader.read().then(common.mustCall(({ done }) => {
      assert(done);
    }));
  }));
  Promise.all([
    writer.write(kEuro),
    writer.close(),
  ]).then(common.mustCall());
  assert.strictEqual(tds.encoding, 'utf-8');
  assert.throws(
    () => Reflect.get(TextEncoderStream.prototype, 'encoding', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextEncoderStream.prototype, 'readable', {}), {
      code: 'ERR_INVALID_THIS',
    });
  assert.throws(
    () => Reflect.get(TextEncoderStream.prototype, 'writable', {}), {
      code: 'ERR_INVALID_THIS',
    });
}
