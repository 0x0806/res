'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { Readable } = require('stream');
const server = http2.createServer(common.mustCall((req, res) => {
  const input = new Readable({
    read() {
      this.push('test');
      this.push(null);
    }
  });
  input.pipe(res);
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const req = client.request();
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
  }));
  let data = '';
  const notCallClose = common.mustNotCall();
  setTimeout(() => {
    req.setEncoding('utf8');
    req.removeListener('close', notCallClose);
    req.on('close', common.mustCall(() => {
      server.close();
      client.close();
    }));
    req.on('data', common.mustCallAtLeast((d) => data += d));
    req.on('end', common.mustCall(() => {
      assert.strictEqual(data, 'test');
    }));
  }, common.platformTimeout(100));
  req.on('close', notCallClose);
}));
