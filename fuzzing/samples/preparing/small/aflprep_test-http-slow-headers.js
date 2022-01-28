'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
const { finished } = require('stream');
const headers =
  'Host: localhost\r\n' +
  'Agent: node\r\n';
const server = createServer(common.mustNotCall());
let sendCharEvery = 1000;
assert.strictEqual(server.headersTimeout, 60 * 1000);
if (!process.env.REAL) {
  sendCharEvery = common.platformTimeout(10);
  server.headersTimeout = 2 * sendCharEvery;
}
server.once('timeout', common.mustCall((socket) => {
  socket.destroy();
}));
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  client.write(headers);
  client.write('X-CRASH: ');
  const interval = setInterval(() => {
    client.write('a');
  }, sendCharEvery);
  client.resume();
  finished(client, common.mustCall((err) => {
    clearInterval(interval);
    server.close();
  }));
}));
