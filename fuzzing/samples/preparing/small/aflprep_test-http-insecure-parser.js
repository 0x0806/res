'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = http.createServer(function(req, res) {
  req.pipe(res);
});
server.listen(0, common.mustCall(function() {
  const bufs = [];
  const client = net.connect(
    this.address().port,
    function() {
      client.write(
        'Connection: close\r\n\r\n');
    }
  );
  client.on('data', function(chunk) {
    bufs.push(chunk);
  });
  client.on('end', common.mustCall(function() {
    const head = Buffer.concat(bufs)
      .toString('latin1')
      .split('\r\n')[0];
    server.close();
  }));
}));
