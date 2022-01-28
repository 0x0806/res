'use strict';
const { mustCall } = common;
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const assert = require('assert');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
} = http2.constants;
const app = http2.createServer(mustCall((req, res) => {
  res.end('hello');
  setImmediate(() => req.socket.destroy());
}));
app.listen(0, mustCall(() => {
  const request = session.request({
    [HTTP2_HEADER_METHOD]: 'get'
  });
  request.once('response', mustCall((headers, flags) => {
    let data = '';
    request.on('data', (chunk) => { data += chunk; });
    request.on('end', mustCall(() => {
      assert.strictEqual(data, 'hello');
      session.close();
      app.close();
    }));
  }));
  request.end();
}));
