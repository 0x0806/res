'use strict';
const assert = require('assert');
const net = require('net');
const N = 50;
let client_recv_count = 0;
let client_end_count = 0;
let disconnect_count = 0;
const server = net.createServer(function(socket) {
  console.error('SERVER: got socket connection');
  socket.resume();
  console.error('SERVER connect, writing');
  socket.write('hello\r\n');
  socket.on('end', () => {
    console.error('SERVER socket end, calling end()');
    socket.end();
  });
  socket.on('close', (had_error) => {
    console.log(`SERVER had_error: ${JSON.stringify(had_error)}`);
    assert.strictEqual(had_error, false);
  });
});
server.listen(0, function() {
  console.log('SERVER listening');
  const client = net.createConnection(this.address().port);
  client.setEncoding('UTF8');
  client.on('connect', () => {
    console.error('CLIENT connected', client._writableState);
  });
  client.on('data', function(chunk) {
    client_recv_count += 1;
    console.log(`client_recv_count ${client_recv_count}`);
    assert.strictEqual(chunk, 'hello\r\n');
    console.error('CLIENT: calling end', client._writableState);
    client.end();
  });
  client.on('end', () => {
    console.error('CLIENT end');
    client_end_count++;
  });
  client.on('close', (had_error) => {
    console.log('CLIENT disconnect');
    assert.strictEqual(had_error, false);
    if (disconnect_count++ < N)
    else
      server.close();
  });
});
process.on('exit', () => {
  assert.strictEqual(disconnect_count, N + 1);
  assert.strictEqual(client_recv_count, N + 1);
  assert.strictEqual(client_end_count, N + 1);
});
