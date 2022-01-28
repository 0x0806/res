'use strict';
const assert = require('assert');
const SlowBuffer = require('buffer').SlowBuffer;
const zeroArray = new Uint32Array(10).fill(0);
const sizes = [1e10, 0, 0.1, -1, 'a', undefined, null, NaN];
const allocators = [
  Buffer,
  SlowBuffer,
  Buffer.alloc,
  Buffer.allocUnsafe,
  Buffer.allocUnsafeSlow,
];
for (const allocator of allocators) {
  for (const size of sizes) {
    try {
      allocator(size);
    } catch {
      assert.deepStrictEqual(zeroArray, new Uint32Array(10));
    }
  }
}
