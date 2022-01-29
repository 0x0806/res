'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
if (cluster.isPrimary) {
  const worker1 = cluster.fork();
  worker1.on('message', common.mustCall(function(msg) {
    assert.strictEqual(msg, 'success');
    const worker2 = cluster.fork();
    worker2.on('message', common.mustCall(function(msg) {
      assert.strictEqual(msg, 'server2:EADDRINUSE');
      worker1.kill();
      worker2.kill();
    }));
  }));
} else {
  const server1 = net.createServer(common.mustNotCall());
  const server2 = net.createServer(common.mustNotCall());
  server1.on('error', function(err) {
    process.send(`server1:${err.code}`);
  });
  server2.on('error', function(err) {
    process.send(`server2:${err.code}`);
  });
  server1.listen({
    host: 'localhost',
    port: common.PORT,
    exclusive: false
  }, common.mustCall(function() {
    server2.listen({ port: common.PORT + 1, exclusive: true },
                   common.mustCall(function() {
                     process.send('success');
                   })
    );
  }));
}
