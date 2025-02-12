'use strict';
const net = require('net');
const http = require('http');
const url = require('url');
const server = http.createServer(common.mustCall((req, res) => {
  console.log(`req: ${JSON.stringify(url.parse(req.url))}`);
  res.write('Hello World');
  res.end();
  server.close();
}));
server.listen(0);
server.on('listening', function() {
  const c = net.createConnection(this.address().port);
  c.on('connect', function() {
    c.end();
  });
});
