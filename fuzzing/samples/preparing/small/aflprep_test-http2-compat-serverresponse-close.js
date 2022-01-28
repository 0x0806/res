'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const server = h2.createServer(common.mustCall((req, res) => {
  res.writeHead(200);
  res.write('a');
  req.on('close', common.mustCall());
  res.on('close', common.mustCall());
  req.on('error', common.mustNotCall());
}));
server.listen(0);
server.on('listening', () => {
  const client = h2.connect(url, common.mustCall(() => {
    const request = client.request();
    request.on('data', common.mustCall(function(chunk) {
      client.destroy();
      server.close();
    }));
  }));
});
