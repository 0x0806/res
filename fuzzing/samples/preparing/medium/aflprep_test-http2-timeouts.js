'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.setTimeout(1, common.mustCall(() => {
    stream.respond({ ':status': 200 });
    stream.end('hello world');
  }));
  assert.throws(
    () => stream.setTimeout('100'),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message:
        'The "msecs" argument must be of type number. Received type string' +
        " ('100')"
    }
  );
  assert.throws(
    () => stream.setTimeout(0, Symbol('test')),
    {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError',
      message: 'Callback must be a function. Received Symbol(test)'
    }
  );
  assert.throws(
    () => stream.setTimeout(100, {}),
    {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError',
      message: 'Callback must be a function. Received {}'
    }
  );
}));
server.listen(0);
server.on('listening', common.mustCall(() => {
  client.setTimeout(1, common.mustCall(() => {
    req.setTimeout(1, common.mustCall(() => {
      req.on('response', common.mustCall());
      req.resume();
      req.on('end', common.mustCall(() => {
        server.close();
        client.close();
      }));
      req.end();
    }));
  }));
}));
