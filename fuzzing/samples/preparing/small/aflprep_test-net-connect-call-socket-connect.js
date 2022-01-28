'use strict';
const net = require('net');
const Socket = net.Socket;
const orig = Socket.prototype.connect;
Socket.prototype.connect = common.mustCall(function() {
  return orig.apply(this, arguments);
});
const server = net.createServer();
server.listen(common.mustCall(function() {
  const port = server.address().port;
  const client = net.connect({ port }, common.mustCall(function() {
    client.end();
  }));
  client.on('end', common.mustCall(function() {
    server.close();
  }));
}));
