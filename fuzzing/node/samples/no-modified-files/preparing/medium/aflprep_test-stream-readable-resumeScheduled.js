'use strict';
const assert = require('assert');
const { Readable, Writable } = require('stream');
{
  const r = new Readable({ read() {} });
  const w = new Writable();
  assert.strictEqual(r._readableState.resumeScheduled, false);
  r.pipe(w);
  assert.strictEqual(r._readableState.resumeScheduled, true);
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
{
  const r = new Readable({ read() {} });
  assert.strictEqual(r._readableState.resumeScheduled, false);
  r.push(Buffer.from([1, 2, 3]));
  r.on('data', common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
  assert.strictEqual(r._readableState.resumeScheduled, true);
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
{
  const r = new Readable({ read() {} });
  assert.strictEqual(r._readableState.resumeScheduled, false);
  r.resume();
  assert.strictEqual(r._readableState.resumeScheduled, true);
  r.on('resume', common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(r._readableState.resumeScheduled, false);
  }));
}
