'use strict';
const http = require('http');
const net = require('net');
const { finished } = require('stream');
const headers =
  'Host: localhost\r\n' +
  'Connection: keep-alive\r\n' +
  'Agent: node\r\n';
const baseTimeout = 1000;
const server = http.createServer(common.mustCall((req, res) => {
  req.resume();
  res.writeHead(200);
  res.end();
}, 2));
server.keepAliveTimeout = 10 * baseTimeout;
server.headersTimeout = baseTimeout;
server.once('timeout', common.mustNotCall((socket) => {
  socket.destroy();
}));
server.listen(0, () => {
  const client = net.connect(server.address().port);
  client.write(headers);
  client.write('\r\n');
  setTimeout(() => {
    client.write(headers);
    setTimeout(() => {
      client.write('\r\n');
      client.end();
    }, 10);
  }, baseTimeout + 10);
  client.resume();
  finished(client, common.mustCall((err) => {
    server.close();
  }));
});
