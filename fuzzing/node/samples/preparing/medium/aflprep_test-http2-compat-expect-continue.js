'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const testResBody = 'other stuff!\n';
const server = http2.createServer();
let sentResponse = false;
server.on('request', common.mustCall((req, res) => {
  res.end(testResBody);
  sentResponse = true;
}));
server.listen(0);
server.on('listening', common.mustCall(() => {
  let body = '';
  const req = client.request({
    ':method': 'POST',
    'expect': '100-continue'
  });
  let gotContinue = false;
  req.on('continue', common.mustCall(() => {
    gotContinue = true;
  }));
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(gotContinue, true);
    assert.strictEqual(sentResponse, true);
    assert.strictEqual(headers[':status'], 200);
    req.end();
  }));
  req.setEncoding('utf8');
  req.on('data', common.mustCall((chunk) => { body += chunk; }));
  req.on('end', common.mustCall(() => {
    assert.strictEqual(body, testResBody);
    client.close();
    server.close();
  }));
}));
