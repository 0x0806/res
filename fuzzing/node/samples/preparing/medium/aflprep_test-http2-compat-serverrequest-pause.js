'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const testStr = 'Request Body from Client';
const server = h2.createServer();
server.on('request', common.mustCall((req, res) => {
  let data = '';
  req.pause();
  req.setEncoding('utf8');
  req.on('data', common.mustCall((chunk) => (data += chunk)));
  setTimeout(common.mustCall(() => {
    assert.strictEqual(data, '');
    req.resume();
  }), common.platformTimeout(100));
  req.on('end', common.mustCall(() => {
    assert.strictEqual(data, testStr);
    res.end();
  }));
  res.on('finish', common.mustCall(() => process.nextTick(() => {
    req.pause();
    req.resume();
  })));
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const request = client.request({
    ':method': 'POST',
    ':scheme': 'http',
    ':authority': `localhost:${port}`
  });
  request.resume();
  request.end(testStr);
  request.on('end', common.mustCall(function() {
    client.close();
    server.close();
  }));
}));
