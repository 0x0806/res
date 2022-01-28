'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const body =
const server = http2.createServer((req, res) => {
  res.setHeader('foobar', 'baz');
  res.setHeader('X-POWERED-BY', 'node-test');
  res.setHeader('connection', 'connection-test');
  res.end(body);
});
server.listen(0, common.mustCall(() => {
  const req = client.request(headers);
  req.setEncoding('utf8');
  req.on('response', common.mustCall(function(headers) {
    assert.strictEqual(headers.foobar, 'baz');
    assert.strictEqual(headers['x-powered-by'], 'node-test');
  }));
  let data = '';
  req.on('data', (d) => data += d);
  req.on('end', () => {
    assert.strictEqual(body, data);
    server.close();
    client.close();
  });
  req.end();
}));
const compatMsg = 'The provided connection header is not valid, ' +
                  'the value will be dropped from the header and ' +
                  'will never be in use.';
common.expectWarning('UnsupportedWarning', compatMsg);
server.on('error', common.mustNotCall());
