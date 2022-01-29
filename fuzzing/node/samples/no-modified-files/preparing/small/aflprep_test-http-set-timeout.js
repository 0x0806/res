'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = http.createServer(function(req, res) {
  console.log('got request. setting 500ms timeout');
  const socket = req.connection.setTimeout(500);
  assert.ok(socket instanceof net.Socket);
  req.connection.on('timeout', common.mustCall(function() {
    req.connection.destroy();
    console.error('TIMEOUT');
    server.close();
  }));
});
server.listen(0, function() {
  request.on('error', common.mustCall(function() {
    console.log('HTTP REQUEST COMPLETE (this is good)');
  }));
  request.end();
});
