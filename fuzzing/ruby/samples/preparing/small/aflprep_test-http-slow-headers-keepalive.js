'use strict';
const http = require('http');
const net = require('net');
const { finished } = require('stream');
const headers =
  'Host: localhost\r\n' +
  'Connection: keep-alive\r\n' +
  'Agent: node\r\n';
let sendCharEvery = 1000;
const server = http.createServer(common.mustCall((req, res) => {
  res.writeHead(200);
  res.end();
}));
if (!process.env.REAL) {
  sendCharEvery = common.platformTimeout(10);
  server.headersTimeout = 2 * sendCharEvery;
}
server.once('timeout', common.mustCall((socket) => {
  socket.destroy();
}));
server.listen(0, () => {
  const client = net.connect(server.address().port);
  client.write(headers);
  client.write('\r\n');
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
});
