'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const fs = require('fs');
const net = require('net');
const path = require('path');
tmpdir.refresh();
const loc = fixtures.path('person-large.jpg');
const fn = path.join(tmpdir.path, 'http2-url-tests.js');
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  const dest = stream.pipe(fs.createWriteStream(fn));
  dest.on('finish', () => {
    assert.strictEqual(fs.readFileSync(loc).length,
                       fs.readFileSync(fn).length);
  });
  stream.respond();
  stream.end();
}));
server.listen(common.PIPE, common.mustCall(() => {
    createConnection(url) {
      return net.connect(server.address());
    }
  });
  const req = client.request({ ':method': 'POST' });
  req.on('response', common.mustCall());
  req.resume();
  req.on('close', common.mustCall(() => {
    server.close();
    client.close();
  }));
  const str = fs.createReadStream(loc);
  str.on('end', common.mustCall());
  str.pipe(req);
}));
