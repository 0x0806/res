'use strict';
const assert = require('assert');
const { arrayBufferViewHasBuffer } = internalBinding('util');
const tests = [
  { length: 0, expectOnHeap: true },
  { length: 48, expectOnHeap: true },
  { length: 96, expectOnHeap: false },
  { length: 1024, expectOnHeap: false },
];
for (const { length, expectOnHeap } of tests) {
  const arrays = [
    new Uint8Array(length),
    Buffer.alloc(length),
    Buffer.allocUnsafeSlow(length),
  ];
  for (const array of arrays) {
    const isOnHeap = !arrayBufferViewHasBuffer(array);
    assert.strictEqual(isOnHeap, expectOnHeap,
                       `mismatch: ${isOnHeap} vs ${expectOnHeap} ` +
                       `for ${array.constructor.name}, length = ${length}`);
    assert(arrayBufferViewHasBuffer(array));
  }
}
