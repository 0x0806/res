'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const s = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.statusMessage = 'Custom Message';
  res.end('');
});
s.listen(0, test);
function test() {
  const bufs = [];
  const client = net.connect(
    this.address().port,
    function() {
    }
  );
  client.on('data', function(chunk) {
    bufs.push(chunk);
  });
  client.on('end', function() {
    const head = Buffer.concat(bufs)
      .toString('latin1')
      .split('\r\n')[0];
    console.log('ok');
    s.close();
  });
}
