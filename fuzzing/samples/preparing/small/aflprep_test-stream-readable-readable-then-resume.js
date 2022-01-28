'use strict';
const { Readable } = require('stream');
const assert = require('assert');
check(new Readable({
  objectMode: true,
  highWaterMark: 1,
  read() {
    if (!this.first) {
      this.push('hello');
      this.first = true;
      return;
    }
    this.push(null);
  }
}));
function check(s) {
  const readableListener = common.mustNotCall();
  s.on('readable', readableListener);
  s.on('end', common.mustCall());
  assert.strictEqual(s.removeListener, s.off);
  s.removeListener('readable', readableListener);
  s.resume();
}
