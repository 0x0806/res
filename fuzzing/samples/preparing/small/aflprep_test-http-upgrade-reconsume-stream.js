'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const http = require('http');
const server = http.createServer(common.mustNotCall());
server.on('upgrade', common.mustCall((request, socket, head) => {
  new tls.TLSSocket(socket);
  server.close();
  socket.destroy();
}));
server.listen(0, common.mustCall(() => {
  http.get({
    port: server.address().port,
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  }).on('error', () => {});
}));
