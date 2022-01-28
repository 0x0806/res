'use strict';
const assert = require('assert');
const http = require('http');
const s = http.createServer(common.mustCall((req, res) => {
  res.setHeader('test', '1');
  assert.throws(
    () => res.setHeader(0xf00, 'bar'),
    {
      code: 'ERR_INVALID_HTTP_TOKEN',
      name: 'TypeError',
      message: 'Header name must be a valid HTTP token ["3840"]'
    }
  );
  assert.throws(
    () => res.setHeader('foo', undefined),
    {
      code: 'ERR_HTTP_INVALID_HEADER_VALUE',
      name: 'TypeError',
      message: 'Invalid value "undefined" for header "foo"'
    }
  );
  res.writeHead(200, { Test: '2' });
  assert.throws(() => {
    res.writeHead(100, {});
  }, {
    code: 'ERR_HTTP_HEADERS_SENT',
    name: 'Error',
    message: 'Cannot render headers after they are sent to the client'
  });
  res.end();
}));
s.listen(0, common.mustCall(runTest));
function runTest() {
  http.get({ port: this.address().port }, common.mustCall((response) => {
    response.on('end', common.mustCall(() => {
      assert.strictEqual(response.headers.test, '2');
      assert(response.rawHeaders.includes('Test'));
      s.close();
    }));
    response.resume();
  }));
}
