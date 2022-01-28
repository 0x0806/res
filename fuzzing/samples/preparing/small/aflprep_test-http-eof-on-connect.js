'use strict';
const net = require('net');
const http = require('http');
const server = http.createServer(common.mustNotCall());
server.listen(0);
server.on('listening', function() {
  net.createConnection(this.address().port).on('connect', function() {
    this.destroy();
  }).on('close', function() {
    server.close();
  });
});
