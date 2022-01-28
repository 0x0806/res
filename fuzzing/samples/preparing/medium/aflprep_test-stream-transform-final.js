'use strict';
const assert = require('assert');
const stream = require('stream');
let state = 0;
const t = new stream.Transform({
  objectMode: true,
  transform: common.mustCall(function(chunk, _, next) {
    assert.strictEqual(++state, chunk);
    this.push(state);
    assert.strictEqual(++state, chunk + 2);
    process.nextTick(next);
  }, 3),
  final: common.mustCall(function(done) {
    state++;
    assert.strictEqual(state, 10);
    setTimeout(function() {
      state++;
      assert.strictEqual(state, 11);
      done();
    }, 100);
  }, 1),
  flush: common.mustCall(function(done) {
    state++;
    assert.strictEqual(state, 12);
    process.nextTick(function() {
      state++;
      assert.strictEqual(state, 13);
      done();
    });
  }, 1)
});
t.on('finish', common.mustCall(function() {
  state++;
  assert.strictEqual(state, 15);
}, 1));
t.on('end', common.mustCall(function() {
  state++;
  assert.strictEqual(state, 16);
}, 1));
t.on('data', common.mustCall(function(d) {
  assert.strictEqual(++state, d + 1);
}, 3));
t.write(1);
t.write(4);
t.end(7, common.mustCall(function() {
  state++;
  assert.strictEqual(state, 14);
}, 1));
