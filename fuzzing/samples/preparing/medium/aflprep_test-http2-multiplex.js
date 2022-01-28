'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
const count = 100;
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.pipe(stream);
}, count));
server.listen(0, common.mustCall(() => {
  client.setMaxListeners(100);
  const countdown = new Countdown(count, () => {
    server.close();
    client.close();
  });
  function doRequest() {
    const req = client.request({ ':method': 'POST' });
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => data += chunk);
    req.on('end', common.mustCall(() => {
      assert.strictEqual(data, 'abcdefghij');
    }));
    req.on('close', common.mustCall(() => countdown.dec()));
    let n = 0;
    function writeChunk() {
      if (n < 10) {
        req.write(String.fromCharCode(97 + n));
        setTimeout(writeChunk, 10);
      } else {
        req.end();
      }
      n++;
    }
    writeChunk();
  }
  for (let n = 0; n < count; n++)
    doRequest();
}));
