'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer();
server.on('request', function(req, res) {
  res.writeHead(200, { 'foo': 'bar' });
  res.flushHeaders();
});
server.listen(0, common.localhostIPv4, function() {
  const req = http.request({
    method: 'GET',
    host: common.localhostIPv4,
    port: this.address().port,
  }, onResponse);
  req.end();
  function onResponse(res) {
    assert.strictEqual(res.headers.foo, 'bar');
    res.destroy();
    server.close();
  }
});
