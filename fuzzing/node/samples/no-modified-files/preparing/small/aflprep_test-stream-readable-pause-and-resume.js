'use strict';
const assert = require('assert');
const { Readable } = require('stream');
let ticks = 18;
let expectedData = 19;
const rs = new Readable({
  objectMode: true,
  read: () => {
    if (ticks-- > 0)
      return process.nextTick(() => rs.push({}));
    rs.push({});
    rs.push(null);
  }
});
rs.on('end', common.mustCall());
readAndPause();
function readAndPause() {
  const ondata = common.mustCall((data) => {
    rs.pause();
    expectedData--;
    if (expectedData <= 0)
      return;
    setImmediate(function() {
      rs.removeListener('data', ondata);
      readAndPause();
      rs.resume();
    });
  rs.on('data', ondata);
}
{
  const readable = new Readable({
    read() {}
  });
  function read() {}
  readable.setEncoding('utf8');
  readable.on('readable', read);
  readable.removeListener('readable', read);
  readable.pause();
  process.nextTick(function() {
    assert(readable.isPaused());
  });
}
