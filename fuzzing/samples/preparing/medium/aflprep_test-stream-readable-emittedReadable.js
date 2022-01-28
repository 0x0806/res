'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
const readable = new Readable({
  read: () => {}
});
assert.strictEqual(readable._readableState.emittedReadable, false);
const expected = [Buffer.from('foobar'), Buffer.from('quo'), null];
readable.on('readable', common.mustCall(() => {
  assert.strictEqual(readable._readableState.emittedReadable, true);
  assert.deepStrictEqual(readable.read(), expected.shift());
  assert.strictEqual(readable._readableState.emittedReadable, false);
}, 3));
assert.strictEqual(readable._readableState.emittedReadable, false);
process.nextTick(common.mustCall(() => {
  readable.push('foo');
}));
process.nextTick(common.mustCall(() => {
  readable.push('bar');
}));
setImmediate(common.mustCall(() => {
  readable.push('quo');
  process.nextTick(common.mustCall(() => {
    readable.push(null);
  }));
}));
const noRead = new Readable({
  read: () => {}
});
noRead.on('readable', common.mustCall(() => {
  assert.strictEqual(noRead._readableState.emittedReadable, true);
  noRead.read(0);
  assert.strictEqual(noRead._readableState.emittedReadable, true);
}));
noRead.push('foo');
noRead.push(null);
const flowing = new Readable({
  read: () => {}
});
flowing.on('data', common.mustCall(() => {
  assert.strictEqual(flowing._readableState.emittedReadable, false);
  flowing.read();
  assert.strictEqual(flowing._readableState.emittedReadable, false);
}, 3));
flowing.push('foooo');
flowing.push('bar');
flowing.push('quo');
process.nextTick(common.mustCall(() => {
  flowing.push(null);
}));
