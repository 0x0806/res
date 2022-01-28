'use strict';
const assert = require('assert');
const stream = require('stream');
const str = 'asdfasdfasdfasdfasdf';
const r = new stream.Readable({
  highWaterMark: 5,
  encoding: 'utf8'
});
let reads = 0;
function _read() {
  if (reads === 0) {
    setTimeout(() => {
      r.push(str);
    }, 1);
    reads++;
  } else if (reads === 1) {
    const ret = r.push(str);
    assert.strictEqual(ret, false);
    reads++;
  } else {
    r.push(null);
  }
}
r._read = common.mustCall(_read, 3);
r.on('end', common.mustCall());
const ret = r.push(str);
assert(!ret);
let chunk = r.read();
assert.strictEqual(chunk, str);
chunk = r.read();
assert.strictEqual(chunk, null);
r.once('readable', () => {
  chunk = r.read();
  assert.strictEqual(chunk, str + str);
  chunk = r.read();
  assert.strictEqual(chunk, null);
});
