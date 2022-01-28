'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer((req, res) => {
  res.end('Hi!\n');
});
server.listen(0, common.mustCall(() => {
  const req = client.request(headers);
  req.on('close', common.mustCall(() => {
    req.removeAllListeners();
    req.on('priority', common.mustNotCall());
    server.close();
  }));
  req.on('priority', common.mustNotCall());
  req.on('error', common.mustCall());
  client.destroy();
}));
