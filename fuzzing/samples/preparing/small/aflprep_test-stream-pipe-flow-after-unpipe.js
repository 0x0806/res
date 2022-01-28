'use strict';
const { Readable, Writable } = require('stream');
const rs = new Readable({
  highWaterMark: 1,
  read: common.mustCallAtLeast(() => rs.push('foo'), 20)
});
const ws = new Writable({
  highWaterMark: 1,
  write: common.mustCall(() => {
    setImmediate(() => rs.unpipe(ws));
  })
});
let chunks = 0;
rs.on('data', common.mustCallAtLeast(() => {
  chunks++;
  if (chunks >= 20)
}));
rs.pipe(ws);
