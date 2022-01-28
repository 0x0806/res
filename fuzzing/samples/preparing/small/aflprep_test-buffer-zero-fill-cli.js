'use strict';
const SlowBuffer = require('buffer').SlowBuffer;
const assert = require('assert');
function isZeroFilled(buf) {
  for (const n of buf)
    if (n > 0) return false;
  return true;
}
for (let i = 0; i < 50; i++) {
  const bufs = [
    Buffer.alloc(20),
    Buffer.allocUnsafe(20),
    SlowBuffer(20),
    Buffer(20),
    new SlowBuffer(20),
  ];
  for (const buf of bufs) {
    assert(isZeroFilled(buf));
  }
}
