'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
process.throwDeprecation = true;
const stream = new Readable({ highWaterMark: 2 });
let reads = 0;
let total = 5000;
stream._read = function(size) {
  reads++;
  size = Math.min(size, total);
  total -= size;
  if (size === 0)
    stream.push(null);
  else
    stream.push(Buffer.allocUnsafe(size));
};
let depth = 0;
function flow(stream, size, callback) {
  depth += 1;
  const chunk = stream.read(size);
  if (!chunk)
    stream.once('readable', flow.bind(null, stream, size, callback));
  else
    callback(chunk);
  depth -= 1;
  console.log(`flow(${depth}): exit`);
}
flow(stream, 5000, function() {
  console.log(`complete (${depth})`);
});
process.on('exit', function(code) {
  assert.strictEqual(reads, 2);
  assert.strictEqual(stream.readableHighWaterMark, 8192);
  assert.strictEqual(stream.readableLength, 0);
  assert(!code);
  assert.strictEqual(depth, 0);
  console.log('ok');
});
