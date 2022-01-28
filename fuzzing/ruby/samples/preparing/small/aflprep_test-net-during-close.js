'use strict';
const net = require('net');
const server = net.createServer(function(socket) {
  socket.end();
});
server.listen(0, common.mustCall(function() {
  const client = net.createConnection(this.address().port);
  server.close();
  client.remoteAddress;
  client.remoteFamily;
  client.remotePort;
  process.exit(0);
}));
