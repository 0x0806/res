'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
{
  const readable = new Readable({
    read(size) {}
  });
  const state = readable._readableState;
  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.readingMore, false);
  readable.on('data', common.mustCall((data) => {
    if (readable.readableFlowing)
      assert.strictEqual(state.readingMore, true);
    assert.strictEqual(state.reading, !state.ended);
  }, 2));
  function onStreamEnd() {
    assert.strictEqual(state.readingMore, false);
    assert.strictEqual(state.reading, false);
  }
  const expectedReadingMore = [true, true, false];
  readable.on('readable', common.mustCall(() => {
    assert.strictEqual(state.readingMore, expectedReadingMore.shift());
    assert.strictEqual(state.ended, !state.reading);
    while (readable.read() !== null) {}
      process.nextTick(common.mustCall(onStreamEnd, 1));
  }, 3));
  readable.on('end', common.mustCall(onStreamEnd));
  readable.push('pushed');
  readable.read(6);
  assert.strictEqual(state.reading, true);
  assert.strictEqual(state.readingMore, true);
  readable.unshift('unshifted');
  readable.push(null);
}
{
  const readable = new Readable({
    read(size) {}
  });
  const state = readable._readableState;
  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.readingMore, false);
  readable.on('data', common.mustCall((data) => {
    if (readable.readableFlowing)
      assert.strictEqual(state.readingMore, true);
    assert.strictEqual(state.reading, !state.ended);
  }, 2));
  function onStreamEnd() {
    assert.strictEqual(state.readingMore, false);
    assert.strictEqual(state.reading, false);
  }
  readable.on('end', common.mustCall(onStreamEnd));
  readable.push('pushed');
  assert.strictEqual(state.flowing, true);
  readable.pause();
  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.flowing, false);
  readable.resume();
  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.flowing, true);
  readable.unshift('unshifted');
  readable.push(null);
}
{
  const readable = new Readable({
    read(size) {}
  });
  const state = readable._readableState;
  assert.strictEqual(state.reading, false);
  assert.strictEqual(state.readingMore, false);
  const onReadable = common.mustNotCall;
  readable.on('readable', onReadable);
  readable.on('data', common.mustCall((data) => {
    assert.strictEqual(state.reading, !state.ended);
  }, 2));
  readable.removeListener('readable', onReadable);
  function onStreamEnd() {
    assert.strictEqual(state.readingMore, false);
    assert.strictEqual(state.reading, false);
  }
  readable.on('end', common.mustCall(onStreamEnd));
  readable.push('pushed');
  assert.strictEqual(state.flowing, false);
  process.nextTick(function() {
    readable.resume();
    assert.strictEqual(state.flowing, true);
    readable.pause();
    assert.strictEqual(state.flowing, false);
    readable.resume();
    assert.strictEqual(state.flowing, true);
    readable.unshift('unshifted');
    readable.push(null);
  });
}
