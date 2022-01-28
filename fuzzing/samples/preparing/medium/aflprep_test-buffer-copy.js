'use strict';
const assert = require('assert');
const b = Buffer.allocUnsafe(1024);
const c = Buffer.allocUnsafe(512);
let cntr = 0;
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = b.copy(c, 0, 0, 512);
  assert.strictEqual(copied, 512);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = b.copy(c, '0', '0', '512');
  assert.strictEqual(copied, 512);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = b.copy(c, 0, 0, 512.5);
  assert.strictEqual(copied, 512);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = c.copy(b, 0, 0);
  assert.strictEqual(copied, c.length);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = c.copy(b, 0);
  assert.strictEqual(copied, c.length);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = c.copy(b, 0, 0, c.length + 1);
  assert.strictEqual(copied, c.length);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(b[i], c[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = b.copy(c);
  assert.strictEqual(copied, c.length);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  }
    assert.strictEqual(c[c.length - 1], c[i]);
  }
}
{
  b.fill(++cntr);
  c.fill(++cntr);
  const copied = b.copy(c, 0, 0, 513);
  assert.strictEqual(copied, c.length);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
{
  b.fill(++cntr);
  b.fill(++cntr, 256);
  const copied = b.copy(b, 0, 256, 1024);
  assert.strictEqual(copied, 768);
  for (let i = 0; i < b.length; i++) {
    assert.strictEqual(b[i], cntr);
  }
}
const bb = Buffer.allocUnsafe(10);
bb.fill('hello crazy world');
b.copy(c, 0, 100, 10);
assert.throws(
  () => Buffer.prototype.copy.call(0),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  }
);
assert.throws(
  () => Buffer.allocUnsafe(5).copy(Buffer.allocUnsafe(5), -1, 0),
  {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "targetStart" is out of range. ' +
             'It must be >= 0. Received -1'
  }
);
assert.throws(
  () => Buffer.allocUnsafe(5).copy(Buffer.allocUnsafe(5), 0, -1),
  {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "sourceStart" is out of range. ' +
             'It must be >= 0. Received -1'
  }
);
{
  b.fill(++cntr);
  c.fill(++cntr);
  b.copy(c, 0, 0, 1025);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], b[i]);
  }
}
assert.throws(
  () => b.copy(c, 0, 0, -1),
  {
    code: 'ERR_OUT_OF_RANGE',
    name: 'RangeError',
    message: 'The value of "sourceEnd" is out of range. ' +
             'It must be >= 0. Received -1'
  }
);
assert.strictEqual(b.copy(c, 0, 100, 10), 0);
assert.strictEqual(b.copy(c, 512, 0, 10), 0);
{
  const d = new Uint8Array(c);
  b.fill(++cntr);
  d.fill(++cntr);
  const copied = b.copy(d, 0, 0, 512);
  assert.strictEqual(copied, 512);
  for (let i = 0; i < d.length; i++) {
    assert.strictEqual(d[i], b[i]);
  }
}
{
  const e = new Uint8Array(b);
  e.fill(++cntr);
  c.fill(++cntr);
  const copied = Buffer.prototype.copy.call(e, c, 0, 0, 512);
  assert.strictEqual(copied, 512);
  for (let i = 0; i < c.length; i++) {
    assert.strictEqual(c[i], e[i]);
  }
}
c.fill('c');
b.copy(c, 'not a valid offset');
assert.deepStrictEqual(c, b.slice(0, c.length));
{
  c.fill('C');
  assert.throws(() => {
    b.copy(c, { [Symbol.toPrimitive]() { throw new Error('foo'); } });
  assert.deepStrictEqual(c.toString(), 'C'.repeat(c.length));
}
