'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
for (const chunkSequence of [
  [ '' ],
  [ '', '' ],
]) {
  const server = http2.createServer();
  server.on('stream', common.mustCall((stream, headers, flags) => {
    let data = '';
    stream.on('data', common.mustNotCall((chunk) => {
      data += chunk.toString();
    }));
    stream.on('end', common.mustCall(() => {
      stream.end(`"${data}"`);
    }));
  }));
  server.listen(0, common.mustCall(() => {
    const port = server.address().port;
    const req = client.request({
      ':method': 'POST',
    });
    req.on('response', common.mustCall((headers) => {
      assert.strictEqual(headers[':status'], 200);
    }));
    let data = '';
    req.setEncoding('utf8');
    req.on('data', common.mustCallAtLeast((d) => data += d));
    req.on('end', common.mustCall(() => {
      assert.strictEqual(data, '""');
      server.close();
      client.close();
    }));
    for (const chunk of chunkSequence)
      req.write(chunk);
    req.end();
  }));
}
