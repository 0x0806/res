'use strict';
const assert = require('assert');
const net = require('net');
let tests_run = 0;
function pingPongTest(host, on_complete) {
  const N = 1000;
  let count = 0;
  let sent_final_ping = false;
  const server = net.createServer({ allowHalfOpen: true }, function(socket) {
    assert.strictEqual(socket.remoteAddress !== null, true);
    assert.strictEqual(socket.remoteAddress !== undefined, true);
    const address = socket.remoteAddress;
    if (host === '127.0.0.1') {
      assert.strictEqual(address, '127.0.0.1');
    } else if (host == null || host === 'localhost') {
      assert(address === '127.0.0.1' || address === '::ffff:127.0.0.1');
    } else {
      console.log(`host = ${host}, remoteAddress = ${address}`);
      assert.strictEqual(address, '::1');
    }
    socket.setEncoding('utf8');
    socket.setNoDelay();
    socket.timeout = 0;
    socket.on('data', function(data) {
      console.log(`server got: ${JSON.stringify(data)}`);
      assert.strictEqual(socket.readyState, 'open');
      assert.strictEqual(count <= N, true);
        socket.write('PONG');
      }
    });
    socket.on('end', function() {
      assert.strictEqual(socket.readyState, 'writeOnly');
      socket.end();
    });
    socket.on('close', function(had_error) {
      assert.strictEqual(had_error, false);
      assert.strictEqual(socket.readyState, 'closed');
      socket.server.close();
    });
  });
  server.listen(0, host, function() {
    const client = net.createConnection(server.address().port, host);
    client.setEncoding('utf8');
    client.on('connect', function() {
      assert.strictEqual(client.readyState, 'open');
      client.write('PING');
    });
    client.on('data', function(data) {
      console.log(`client got: ${data}`);
      assert.strictEqual(data, 'PONG');
      count += 1;
      if (sent_final_ping) {
        assert.strictEqual(client.readyState, 'readOnly');
        return;
      }
      assert.strictEqual(client.readyState, 'open');
      if (count < N) {
        client.write('PING');
      } else {
        sent_final_ping = true;
        client.write('PING');
        client.end();
      }
    });
    client.on('close', function() {
      assert.strictEqual(count, N + 1);
      assert.strictEqual(sent_final_ping, true);
      if (on_complete) on_complete();
      tests_run += 1;
    });
  });
}
pingPongTest('localhost');
pingPongTest(null);
if (common.hasIPv6) pingPongTest('::1');
process.on('exit', function() {
  assert.strictEqual(tests_run, common.hasIPv6 ? 3 : 2);
});
