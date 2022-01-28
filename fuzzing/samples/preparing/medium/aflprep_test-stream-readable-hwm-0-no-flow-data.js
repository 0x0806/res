'use strict';
const assert = require('assert');
const { Readable } = require('stream');
const streamData = [ 'a', null ];
const calls = [];
const r = new Readable({
  read: common.mustCall(() => {
    calls.push('_read:' + streamData[0]);
    process.nextTick(() => {
      calls.push('push:' + streamData[0]);
      r.push(streamData.shift());
    });
  }, streamData.length),
  highWaterMark: 0,
  objectMode: true,
});
assert.strictEqual(r.readableFlowing, null);
r.on('readable', common.mustCall(() => {
  calls.push('readable');
}, 2));
assert.strictEqual(r.readableFlowing, false);
r.on('data', common.mustCall((data) => {
  calls.push('data:' + data);
}, 1));
r.on('end', common.mustCall(() => {
  calls.push('end');
}));
assert.strictEqual(r.readableFlowing, false);
setImmediate(() => {
  assert.deepStrictEqual(calls, ['_read:a', 'push:a', 'readable']);
  assert.strictEqual(r.read(), 'a');
  assert.deepStrictEqual(
    calls,
    ['_read:a', 'push:a', 'readable', 'data:a']);
  assert.strictEqual(r.read(), null);
  setImmediate(() => {
    assert.deepStrictEqual(
      calls,
      ['_read:a', 'push:a', 'readable', 'data:a',
       '_read:null', 'push:null', 'readable']);
    assert.strictEqual(r.read(), null);
    assert.deepStrictEqual(
      calls,
      ['_read:a', 'push:a', 'readable', 'data:a',
       '_read:null', 'push:null', 'readable']);
    process.nextTick(() => {
      assert.deepStrictEqual(
        calls,
        ['_read:a', 'push:a', 'readable', 'data:a',
         '_read:null', 'push:null', 'readable', 'end']);
    });
  });
});
