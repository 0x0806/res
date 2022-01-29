'use strict';
const net = require('net');
const server = net.createServer(common.mustCall(function(conn) {
  conn.end();
  server.close();
})).listen(0, common.mustCall(function() {
  const client = new net.Socket();
  client.on('ready', common.mustCall(function() {
    client.end();
  }));
  client.connect(server.address());
}));
