'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
let sendDelayedRequestHeaders;
const server = createServer(common.mustNotCall());
server.on('connection', common.mustCall(() => {
  assert.strictEqual(typeof sendDelayedRequestHeaders, 'function');
  sendDelayedRequestHeaders();
}));
assert.strictEqual(server.requestTimeout, 0);
const requestTimeout = common.platformTimeout(1000);
server.requestTimeout = requestTimeout;
assert.strictEqual(server.requestTimeout, requestTimeout);
server.on('upgrade', common.mustCall((req, socket, head) => {
  socket.write('Upgrade: WebSocket\r\n');
  socket.write('Connection: Upgrade\r\n\r\n');
  socket.pipe(socket);
}));
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  let response = '';
  client.on('data', common.mustCallAtLeast((chunk) => {
    response += chunk.toString('utf-8');
  }, 1));
  client.on('end', common.mustCall(() => {
    assert.strictEqual(
      response,
      'Upgrade: WebSocket\r\n' +
      'Connection: Upgrade\r\n\r\n' +
      '12345678901234567890'
    );
    server.close();
  }));
  client.resume();
  client.write('Upgrade: WebSocket\r\n');
  client.write('Connection: Upgrade\r\n\r\n');
  sendDelayedRequestHeaders = common.mustCall(() => {
    setTimeout(() => {
      client.write('12345678901234567890');
      client.end();
    }, common.platformTimeout(2000)).unref();
  });
}));
