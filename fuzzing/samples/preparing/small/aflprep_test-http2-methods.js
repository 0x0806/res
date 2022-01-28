'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
const methods = ['GET', 'POST', 'PATCH', 'FOO', 'A_B_C'];
let expected = methods.length;
server.on('stream', common.mustCall(onStream, expected));
function onStream(stream, headers, flags) {
  const method = headers[':method'];
  assert.notStrictEqual(method, undefined);
  assert(methods.includes(method), `method ${method} not included`);
  stream.respond({
    ':status': 200
  });
  stream.end('hello world');
}
server.listen(0);
server.on('listening', common.mustCall(() => {
  methods.forEach((method) => {
    headers[':method'] = method;
    const req = client.request(headers);
    req.on('response', common.mustCall());
    req.resume();
    req.on('end', common.mustCall(() => {
      if (--expected === 0) {
        server.close();
        client.close();
      }
    }));
    req.end();
  });
}));
