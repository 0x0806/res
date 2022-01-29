'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer(common.mustCall((req, res) => {
  req.stream.destroy();
  res.writeHead(200);
  res.write('hello ');
  res.end('world');
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('response', common.mustNotCall());
  req.on('close', common.mustCall((arg) => {
    client.close();
    server.close();
  }));
  req.resume();
}));
