'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
let client;
let req;
const server = http2.createServer();
server.on('stream', common.mustCall((stream) => {
  stream.on('error', common.mustCall(() => {
    client.close();
    stream.on('close', common.mustCall(() => {
      server.close();
    }));
  }));
  req.close(2);
}));
server.listen(0, common.mustCall(() => {
  req = client.request();
  req.resume();
  req.on('error', common.mustCall(() => {
    req.on('close', common.mustCall());
  }));
}));
