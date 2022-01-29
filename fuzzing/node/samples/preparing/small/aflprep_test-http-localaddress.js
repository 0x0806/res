'use strict';
if (!common.hasMultiLocalhost())
  common.skip('platform-specific test.');
const http = require('http');
const assert = require('assert');
const server = http.createServer((req, res) => {
  console.log(`Connect from: ${req.connection.remoteAddress}`);
  assert.strictEqual(req.connection.remoteAddress, '127.0.0.2');
  req.on('end', () => {
    res.end(`You are from: ${req.connection.remoteAddress}`);
  });
  req.resume();
});
server.listen(0, '127.0.0.1', () => {
  const options = { host: 'localhost',
                    port: server.address().port,
                    method: 'GET',
                    localAddress: '127.0.0.2' };
  const req = http.request(options, function(res) {
    res.on('end', () => {
      server.close();
    });
    res.resume();
  });
  req.end();
});
