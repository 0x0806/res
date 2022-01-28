'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end('ok');
}));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.priority({});
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall());
  req.on('close', common.mustCall(() => {
    server.close();
    client.close();
  }));
}));
