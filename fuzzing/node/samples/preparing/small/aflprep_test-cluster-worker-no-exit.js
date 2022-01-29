'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
let destroyed;
let success;
let worker;
let server;
if (cluster.isPrimary) {
  server = net.createServer(function(conn) {
    server.close();
    worker.disconnect();
    worker.once('disconnect', function() {
      setTimeout(function() {
        conn.destroy();
        destroyed = true;
      }, 1000);
    }).once('exit', function() {
      assert(destroyed, 'worker exited before connection destroyed');
      success = true;
    });
  }).listen(0, function() {
    const port = this.address().port;
    worker = cluster.fork()
      .on('online', function() {
        this.send({ port });
      });
  });
  process.on('exit', function() {
    assert(success);
  });
} else {
  process.on('message', function(msg) {
    net.connect(msg.port);
  });
}
