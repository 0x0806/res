'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
            '0%c4%8d%c4%8aLast­Modified:%20Mon,%2027%20Oct%202003%2014:50:18' +
const y = 'foo⠊Set-Cookie: foo=bar';
let remaining = 3;
function makeUrl(headers) {
}
const server = http2.createServer();
server.on('stream', common.mustCall((stream, headers) => {
  const obj = Object.create(null);
  switch (remaining--) {
    case 3:
      const url = new URL(makeUrl(headers));
      obj[':status'] = 302;
      break;
    case 2:
      obj.foo = x;
      break;
    case 1:
      obj.foo = y;
      break;
  }
  stream.respond(obj);
  stream.end();
}, 3));
server.listen(0, common.mustCall(() => {
  function maybeClose() {
    if (remaining === 0) {
      server.close();
      client.close();
    }
  }
  function doTest(path, key, expected) {
    const req = client.request({ ':path': path });
    req.on('response', common.mustCall((headers) => {
      assert.strictEqual(headers.foo, undefined);
      assert.strictEqual(headers.location, undefined);
    }));
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(maybeClose));
  }
  doTest(str, 'location', str);
}));
