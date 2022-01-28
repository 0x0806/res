'use strict';
const stream = require('stream');
function test(throwCodeInbetween) {
  const n = 1000;
  let counter = n;
  const rs = stream.Readable({
    objectMode: true,
    read: common.mustCallAtLeast(() => {
      if (--counter >= 0)
        rs.push({ counter });
      else
        rs.push(null);
    }, n)
  });
  const ws = stream.Writable({
    objectMode: true,
    write: common.mustCall((data, enc, cb) => {
      setImmediate(cb);
    }, n)
  });
  setImmediate(() => throwCodeInbetween(rs, ws));
  rs.pipe(ws);
}
test((rs) => rs.read());
test((rs) => rs.resume());
test(() => 0);
