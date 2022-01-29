'use strict';
const assert = require('assert');
const http = require('http');
{
  const { clientSide, serverSide } = MakeDuplexPair();
  serverSide.on('data', common.mustCall((data) => {
    assert.strictEqual(data.toString('utf8'), `\
Expect: 100-continue
Host: localhost:80
Connection: close
    setImmediate(() => {
    });
  }));
  const req = http.request({
    createConnection: common.mustCall(() => clientSide),
    headers: {
      'Expect': '100-continue'
    }
  });
  req.on('continue', common.mustCall((res) => {
    let sync = true;
    clientSide._writev = null;
    clientSide._write = common.mustCall((chunk, enc, cb) => {
      assert(sync);
      assert.strictEqual(chunk.length, 0);
      clientSide.destroy(new Error('sometimes the code just doesn’t work'), cb);
    });
    req.on('error', common.mustCall());
    req.end();
    sync = false;
  }));
}
