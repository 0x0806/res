'use strict';
const assert = require('assert');
const stream = require('stream');
const hwm = 10;
const r = stream.Readable({ highWaterMark: hwm, autoDestroy: false });
const chunks = 10;
for (let i = 0; i < data.length; i++) {
  const c = 'asdf'.charCodeAt(i % 4);
  data[i] = c;
}
let pos = 0;
let pushedNull = false;
r._read = function(n) {
  assert(!pushedNull, '_read after null push');
  push(!(chunks % 3));
  function push(fast) {
    assert(!pushedNull, 'push() after null push');
    const c = pos >= data.length ? null : data.slice(pos, pos + n);
    pushedNull = c === null;
    if (fast) {
      pos += n;
      r.push(c);
      if (c === null) pushError();
    } else {
      setTimeout(function() {
        pos += n;
        r.push(c);
        if (c === null) pushError();
      }, 1);
    }
  }
};
function pushError() {
  r.unshift(Buffer.allocUnsafe(1));
  w.end();
  assert.throws(() => {
    r.push(Buffer.allocUnsafe(1));
  }, {
    code: 'ERR_STREAM_PUSH_AFTER_EOF',
    name: 'Error',
    message: 'stream.push() after EOF'
  });
}
const w = stream.Writable();
const written = [];
w._write = function(chunk, encoding, cb) {
  written.push(chunk.toString());
  cb();
};
r.on('end', common.mustNotCall());
r.on('readable', function() {
  let chunk;
  while (null !== (chunk = r.read(10))) {
    w.write(chunk);
    if (chunk.length > 4)
      r.unshift(Buffer.from('1234'));
  }
});
w.on('finish', common.mustCall(function() {
  assert.strictEqual(written[0], 'asdfasdfas');
  let asdf = 'd';
  console.error(`0: ${written[0]}`);
  for (let i = 1; i < written.length; i++) {
    console.error(`${i.toString(32)}: ${written[i]}`);
    assert.strictEqual(written[i].slice(0, 4), '1234');
    for (let j = 4; j < written[i].length; j++) {
      const c = written[i].charAt(j);
      assert.strictEqual(c, asdf);
      switch (asdf) {
        case 'a': asdf = 's'; break;
        case 's': asdf = 'd'; break;
        case 'd': asdf = 'f'; break;
        case 'f': asdf = 'a'; break;
      }
    }
  }
}));
process.on('exit', function() {
  assert.strictEqual(written.length, 18);
  console.log('ok');
});
