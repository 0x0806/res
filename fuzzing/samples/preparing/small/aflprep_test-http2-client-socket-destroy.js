'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const body =
const server = h2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.on('aborted', common.mustCall());
  stream.on('close', common.mustCall());
  stream.respond();
  stream.write(body);
}));
server.listen(0, common.mustCall(function() {
  const req = client.request();
  req.on('response', common.mustCall(() => {
    client[kSocket].destroy();
  }));
  req.resume();
  req.on('end', common.mustCall());
  req.on('close', common.mustCall(() => server.close()));
  client.on('close', common.mustCall());
}));
