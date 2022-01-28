'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall(onStream));
const status101regex =
const afterRespondregex =
function onStream(stream, headers, flags) {
  assert.throws(() => stream.additionalHeaders({ ':status': 201 }),
                {
                  code: 'ERR_HTTP2_INVALID_INFO_STATUS',
                  name: 'RangeError',
                });
  assert.throws(() => stream.additionalHeaders({ ':status': 101 }),
                {
                  code: 'ERR_HTTP2_STATUS_101',
                  name: 'Error',
                  message: status101regex
                });
  assert.throws(
    () => stream.additionalHeaders({ ':method': 'POST' }),
    {
      code: 'ERR_HTTP2_INVALID_PSEUDOHEADER',
      name: 'TypeError',
      message: '":method" is an invalid pseudoheader or is used incorrectly'
    }
  );
  stream.additionalHeaders({ ':status': 100 });
  stream.additionalHeaders({ ':status': 100 });
  stream.respond({
    ':status': 200
  });
  assert.throws(() => stream.additionalHeaders({ abc: 123 }),
                {
                  code: 'ERR_HTTP2_HEADERS_AFTER_RESPOND',
                  name: 'Error',
                  message: afterRespondregex
                });
  stream.end('hello world');
}
server.listen(0);
server.on('listening', common.mustCall(() => {
  assert.strictEqual(req.additionalHeaders, undefined);
  req.on('headers', common.mustCall((headers) => {
    assert.notStrictEqual(headers, undefined);
    assert.strictEqual(headers[':status'], 100);
  }, 2));
  req.on('response', common.mustCall((headers) => {
    assert.notStrictEqual(headers, undefined);
    assert.strictEqual(headers[':status'], 200);
  }));
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.close();
  }));
  req.end();
}));
