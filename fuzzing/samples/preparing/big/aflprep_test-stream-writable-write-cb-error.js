'use strict';
const { Writable } = require('stream');
const assert = require('assert');
{
  let callbackCalled = false;
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb(new Error());
    })
  });
  writable.on('error', common.mustCall(() => {
    assert.strictEqual(callbackCalled, true);
  }));
  writable.write('hi', common.mustCall(() => {
    callbackCalled = true;
  }));
}
{
  let callbackCalled = false;
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      process.nextTick(cb, new Error());
    })
  });
  writable.on('error', common.mustCall(() => {
    assert.strictEqual(callbackCalled, true);
  }));
  writable.write('hi', common.mustCall(() => {
    callbackCalled = true;
  }));
}
{
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb(new Error());
    })
  });
  writable.on('error', common.mustCall());
  let cnt = 0;
  while (writable.write('a'))
    cnt++;
  assert.strictEqual(cnt, 0);
}
