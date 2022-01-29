'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
const readable = new Readable({
  read: () => {}
});
assert.strictEqual(readable._readableState.needReadable, false);
readable.on('readable', common.mustCall(() => {
  assert.strictEqual(readable._readableState.needReadable, false);
  readable.read();
}));
assert.strictEqual(readable._readableState.needReadable, true);
readable.push('foo');
readable.push(null);
readable.on('end', common.mustCall(() => {
  assert.strictEqual(readable._readableState.needReadable, false);
}));
const asyncReadable = new Readable({
  read: () => {}
});
asyncReadable.on('readable', common.mustCall(() => {
  if (asyncReadable.read() !== null) {
    assert.strictEqual(asyncReadable._readableState.needReadable, true);
  }
}, 2));
process.nextTick(common.mustCall(() => {
  asyncReadable.push('foooo');
}));
process.nextTick(common.mustCall(() => {
  asyncReadable.push('bar');
}));
setImmediate(common.mustCall(() => {
  asyncReadable.push(null);
  assert.strictEqual(asyncReadable._readableState.needReadable, false);
}));
const flowing = new Readable({
  read: () => {}
});
flowing.push('foooo');
flowing.push('bar');
flowing.push('quo');
process.nextTick(common.mustCall(() => {
  flowing.push(null);
}));
flowing.on('data', common.mustCall(function(data) {
  assert.strictEqual(flowing._readableState.needReadable, false);
}, 3));
const slowProducer = new Readable({
  read: () => {}
});
slowProducer.on('readable', common.mustCall(() => {
  const chunk = slowProducer.read(8);
  const state = slowProducer._readableState;
  if (chunk === null) {
    assert.strictEqual(state.needReadable, true);
  } else {
    assert.strictEqual(state.needReadable, false);
  }
}, 4));
process.nextTick(common.mustCall(() => {
  slowProducer.push('foo');
  process.nextTick(common.mustCall(() => {
    slowProducer.push('foo');
    process.nextTick(common.mustCall(() => {
      slowProducer.push('foo');
      process.nextTick(common.mustCall(() => {
        slowProducer.push(null);
      }));
    }));
  }));
}));
