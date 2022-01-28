'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
['DELETE', 'PATCH', 'PURGE'].forEach(function(method, index) {
  const server = http.createServer(common.mustCall(function(req, res) {
    assert.strictEqual(req.method, method);
    res.write('hello ');
    res.write('world\n');
    res.end();
  }));
  server.listen(0);
  server.on('listening', common.mustCall(function() {
    const c = net.createConnection(this.address().port);
    let server_response = '';
    c.setEncoding('utf8');
    c.on('connect', function() {
    });
    c.on('data', function(chunk) {
      console.log(chunk);
      server_response += chunk;
    });
    c.on('end', common.mustCall(function() {
      const m = server_response.split('\r\n\r\n');
      assert.strictEqual(m[1], 'hello world\n');
      c.end();
    }));
    c.on('close', function() {
      server.close();
    });
  }));
});
