'use strict';
const fs = require('fs');
const assert = require('assert');
const filepath = fixtures.path('x.txt');
const fd = fs.openSync(filepath, 'r');
const expected = Buffer.from('xyz\n');
function runTest(defaultBuffer, options) {
  const result = fs.readSync(fd, defaultBuffer, options);
  assert.strictEqual(result, expected.length);
  assert.deepStrictEqual(defaultBuffer, expected);
}
runTest(Buffer.allocUnsafe(expected.length), { position: 0 });
runTest(Buffer.allocUnsafe(expected.length));
runTest(Buffer.allocUnsafe(expected.length), { offset: 0,
                                               length: expected.length,
                                               position: 0 });
