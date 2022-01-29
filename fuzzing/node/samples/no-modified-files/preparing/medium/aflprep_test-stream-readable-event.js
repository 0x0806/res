'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
{
  const r = new Readable({
    highWaterMark: 3
  });
  r._read = common.mustNotCall();
  r.push(Buffer.from('blerg'));
  setTimeout(function() {
    assert(!r._readableState.reading);
    r.on('readable', common.mustCall());
  }, 1);
}
{
  const r = new Readable({
    highWaterMark: 3
  });
  r._read = common.mustCall();
  r.push(Buffer.from('bl'));
  setTimeout(function() {
    assert(r._readableState.reading);
    r.on('readable', common.mustCall());
  }, 1);
}
{
  const r = new Readable({
    highWaterMark: 30
  });
  r._read = common.mustNotCall();
  r.push(Buffer.from('blerg'));
  r.push(null);
  setTimeout(function() {
    assert(!r._readableState.reading);
    r.on('readable', common.mustCall());
  }, 1);
}
{
  const underlyingData = ['', 'x', 'y', '', 'z'];
  const expected = underlyingData.filter((data) => data);
  const result = [];
  const r = new Readable({
    encoding: 'utf8',
  });
  r._read = function() {
    process.nextTick(() => {
      if (!underlyingData.length) {
        this.push(null);
      } else {
        this.push(underlyingData.shift());
      }
    });
  };
  r.on('readable', () => {
    const data = r.read();
    if (data !== null) result.push(data);
  });
  r.on('end', common.mustCall(() => {
    assert.deepStrictEqual(result, expected);
  }));
}
{
  const r = new Readable();
  r._read = function() {
  };
  r.on('data', function() {});
  r.removeAllListeners();
  assert.strictEqual(r.eventNames().length, 0);
}
