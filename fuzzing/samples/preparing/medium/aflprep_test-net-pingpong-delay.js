'use strict';
const assert = require('assert');
const net = require('net');
function pingPongTest(host, on_complete) {
  const N = 100;
  const DELAY = 1;
  let count = 0;
  let client_ended = false;
  const server = net.createServer({ allowHalfOpen: true }, function(socket) {
    socket.setEncoding('utf8');
    socket.on('data', function(data) {
      console.log(data);
      assert.strictEqual(data, 'PING');
      assert.strictEqual(socket.readyState, 'open');
      assert.strictEqual(count <= N, true);
      setTimeout(function() {
        assert.strictEqual(socket.readyState, 'open');
        socket.write('PONG');
      }, DELAY);
    });
    socket.on('timeout', function() {
      console.error('server-side timeout!!');
      assert.strictEqual(false, true);
    });
    socket.on('end', function() {
      console.log('server-side socket EOF');
      assert.strictEqual(socket.readyState, 'writeOnly');
      socket.end();
    });
    socket.on('close', function(had_error) {
      console.log('server-side socket.end');
      assert.strictEqual(had_error, false);
      assert.strictEqual(socket.readyState, 'closed');
      socket.server.close();
    });
  });
  server.listen(0, host, common.mustCall(function() {
    const client = net.createConnection(server.address().port, host);
    client.setEncoding('utf8');
    client.on('connect', function() {
      assert.strictEqual(client.readyState, 'open');
      client.write('PING');
    });
    client.on('data', function(data) {
      console.log(data);
      assert.strictEqual(data, 'PONG');
      assert.strictEqual(client.readyState, 'open');
      setTimeout(function() {
        assert.strictEqual(client.readyState, 'open');
        if (count++ < N) {
          client.write('PING');
        } else {
          console.log('closing client');
          client.end();
          client_ended = true;
        }
      }, DELAY);
    });
    client.on('timeout', function() {
      console.error('client-side timeout!!');
      assert.strictEqual(false, true);
    });
    client.on('close', common.mustCall(function() {
      console.log('client.end');
      assert.strictEqual(count, N + 1);
      assert.ok(client_ended);
      if (on_complete) on_complete();
    }));
  }));
}
pingPongTest();
