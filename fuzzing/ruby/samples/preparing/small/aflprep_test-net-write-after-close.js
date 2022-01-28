'use strict';
const assert = require('assert');
const net = require('net');
let serverSocket;
const server = net.createServer(common.mustCall(function(socket) {
  serverSocket = socket;
  socket.resume();
  socket.on('error', common.mustNotCall());
}));
server.listen(0, function() {
  const client = net.connect(this.address().port, function() {
    client.on('end', common.mustCall(() => {
      serverSocket.write('test', common.mustCall((err) => {
        assert(err);
        server.close();
      }));
    }));
    client.end();
  });
});
