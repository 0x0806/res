'use strict';
const assert = require('assert');
[-1, 10].forEach((offset) => {
  assert.throws(
    () => Buffer.alloc(9).write('foo', offset),
    {
      code: 'ERR_OUT_OF_RANGE',
      name: 'RangeError',
      message: 'The value of "offset" is out of range. ' +
               `It must be >= 0 && <= 9. Received ${offset}`
    }
  );
});
const resultMap = new Map([
  ['utf8', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['ucs2', Buffer.from([102, 0, 111, 0, 111, 0, 0, 0, 0])],
  ['ascii', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['latin1', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['binary', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['utf16le', Buffer.from([102, 0, 111, 0, 111, 0, 0, 0, 0])],
  ['base64', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['base64url', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
  ['hex', Buffer.from([102, 111, 111, 0, 0, 0, 0, 0, 0])],
]);
const encodings = ['utf8', 'utf-8', 'ucs2', 'ucs-2', 'ascii', 'latin1',
                   'binary', 'utf16le', 'utf-16le'];
encodings
  .reduce((es, e) => es.concat(e, e.toUpperCase()), [])
  .forEach((encoding) => {
    const buf = Buffer.alloc(9);
    const len = Buffer.byteLength('foo', encoding);
    assert.strictEqual(buf.write('foo', 0, len, encoding), len);
    if (encoding.includes('-'))
      encoding = encoding.replace('-', '');
    assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
  });
['base64', 'BASE64', 'base64url', 'BASE64URL'].forEach((encoding) => {
  const buf = Buffer.alloc(9);
  const len = Buffer.byteLength('Zm9v', encoding);
  assert.strictEqual(buf.write('Zm9v', 0, len, encoding), len);
  assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
});
['hex', 'HEX'].forEach((encoding) => {
  const buf = Buffer.alloc(9);
  const len = Buffer.byteLength('666f6f', encoding);
  assert.strictEqual(buf.write('666f6f', 0, len, encoding), len);
  assert.deepStrictEqual(buf, resultMap.get(encoding.toLowerCase()));
});
for (let i = 1; i < 10; i++) {
  const encoding = String(i).repeat(i);
  const error = common.expectsError({
    code: 'ERR_UNKNOWN_ENCODING',
    name: 'TypeError',
    message: `Unknown encoding: ${encoding}`
  });
  assert.ok(!Buffer.isEncoding(encoding));
  assert.throws(() => Buffer.alloc(9).write('foo', encoding), error);
}
for (let i = 1; i < 4; i++) {
  const x = Buffer.allocUnsafe(4).fill(0);
  const y = Buffer.allocUnsafe(4).fill(1);
  assert.strictEqual(x.write('ыыыыыы', 3, 'ucs2'), 0);
  assert.strictEqual(Buffer.compare(y, Buffer.alloc(4, 1)), 0);
}
const z = Buffer.alloc(4, 0);
assert.strictEqual(z.write('\u0001', 3, 'ucs2'), 0);
assert.strictEqual(Buffer.compare(z, Buffer.alloc(4, 0)), 0);
assert.strictEqual(z.write('abcd', 2), 2);
assert.deepStrictEqual([...z], [0, 0, 0x61, 0x62]);
assert.strictEqual(Buffer.alloc(4)
  .write('ыыыыыы'.repeat(100), 3, 'utf16le'), 0);
{
  const buf = Buffer.alloc(8);
  assert.strictEqual(buf.write('ыы', 1, 'utf16le'), 4);
  assert.deepStrictEqual([...buf], [0, 0x4b, 0x04, 0x4b, 0x04, 0, 0, 0]);
}
