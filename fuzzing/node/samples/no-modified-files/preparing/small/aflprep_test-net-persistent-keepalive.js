'use strict';
const assert = require('assert');
const net = require('net');
let serverConnection;
let clientConnection;
const echoServer = net.createServer(function(connection) {
  serverConnection = connection;
  setTimeout(function() {
    assert.strictEqual(serverConnection.readyState, 'open');
    assert.strictEqual(clientConnection.readyState, 'open');
    serverConnection.end();
    clientConnection.end();
    echoServer.close();
  }, 600);
  connection.setTimeout(0);
  assert.strictEqual(typeof connection.setKeepAlive, 'function');
  connection.on('end', function() {
    connection.end();
  });
});
echoServer.listen(0);
echoServer.on('listening', function() {
  clientConnection = new net.Socket();
  const s = clientConnection.setKeepAlive(true, 400);
  assert.ok(s instanceof net.Socket);
  clientConnection.connect(this.address().port);
  clientConnection.setTimeout(0);
});
