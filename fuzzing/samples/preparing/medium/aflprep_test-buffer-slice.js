'use strict';
const assert = require('assert');
assert.strictEqual(Buffer.from('hello', 'utf8').slice(0, 0).length, 0);
assert.strictEqual(Buffer('hello', 'utf8').slice(0, 0).length, 0);
const buf = Buffer.from('0123456789', 'utf8');
const expectedSameBufs = [
  [buf.slice(-10, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(-20, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(-20, -10), Buffer.from('', 'utf8')],
  [buf.slice(), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0, 0), Buffer.from('', 'utf8')],
  [buf.slice(undefined), Buffer.from('0123456789', 'utf8')],
  [buf.slice('foobar'), Buffer.from('0123456789', 'utf8')],
  [buf.slice(undefined, undefined), Buffer.from('0123456789', 'utf8')],
  [buf.slice(2), Buffer.from('23456789', 'utf8')],
  [buf.slice(5), Buffer.from('56789', 'utf8')],
  [buf.slice(10), Buffer.from('', 'utf8')],
  [buf.slice(5, 8), Buffer.from('567', 'utf8')],
  [buf.slice(8, -1), Buffer.from('8', 'utf8')],
  [buf.slice(-10), Buffer.from('0123456789', 'utf8')],
  [buf.slice(0, -9), Buffer.from('0', 'utf8')],
  [buf.slice(0, -10), Buffer.from('', 'utf8')],
  [buf.slice(0, -1), Buffer.from('012345678', 'utf8')],
  [buf.slice(2, -2), Buffer.from('234567', 'utf8')],
  [buf.slice(0, 65536), Buffer.from('0123456789', 'utf8')],
  [buf.slice(65536, 0), Buffer.from('', 'utf8')],
  [buf.slice(-5, -8), Buffer.from('', 'utf8')],
  [buf.slice(-5, -3), Buffer.from('56', 'utf8')],
  [buf.slice(-10, 10), Buffer.from('0123456789', 'utf8')],
  [buf.slice('0', '1'), Buffer.from('0', 'utf8')],
  [buf.slice('-5', '10'), Buffer.from('56789', 'utf8')],
  [buf.slice('-10', '10'), Buffer.from('0123456789', 'utf8')],
  [buf.slice('-10', '-5'), Buffer.from('01234', 'utf8')],
  [buf.slice('-10', '-0'), Buffer.from('', 'utf8')],
  [buf.slice('111'), Buffer.from('', 'utf8')],
  [buf.slice('0', '-111'), Buffer.from('', 'utf8')],
];
for (let i = 0, s = buf.toString(); i < buf.length; ++i) {
  expectedSameBufs.push(
    [buf.slice(i), Buffer.from(s.slice(i))],
    [buf.slice(0, i), Buffer.from(s.slice(0, i))],
    [buf.slice(-i), Buffer.from(s.slice(-i))],
    [buf.slice(0, -i), Buffer.from(s.slice(0, -i))]
  );
}
expectedSameBufs.forEach(([buf1, buf2]) => {
  assert.strictEqual(Buffer.compare(buf1, buf2), 0);
});
const utf16Buf = Buffer.from('0123456789', 'utf16le');
assert.deepStrictEqual(utf16Buf.slice(0, 6), Buffer.from('012', 'utf16le'));
assert.strictEqual(Buffer.alloc(0).slice(0, 1).length, 0);
{
  assert.strictEqual(Buffer.from('abcde', 'utf8').slice(1).toString('utf8'),
                     'bcde');
}
assert.strictEqual(Buffer.from('hello', 'utf8').slice(0, 0).length, 0);
{
  const buf = Buffer.from('abcd', 'utf8');
  assert.strictEqual(
    'bcd'
  );
}
{
  const buf = Buffer.from('abcdefg', 'utf8');
  assert.strictEqual(buf.slice(-(-1 >>> 0) - 1).toString('utf8'),
                     buf.toString('utf8'));
}
{
  const buf = Buffer.from('abc', 'utf8');
  assert.strictEqual(buf.slice(-0.5).toString('utf8'), buf.toString('utf8'));
}
{
  const buf = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0,
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0,
  ]);
  const chunk1 = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0,
  ]);
  const chunk2 = Buffer.from([
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0,
  ]);
  assert.deepStrictEqual(buf.slice(0, middle), chunk1);
  assert.deepStrictEqual(buf.slice(middle), chunk2);
}
