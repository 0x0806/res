'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
const server = net.createServer(function(socket) {
}).listen(0, common.mustCall(function() {
  http.get({ port: this.address().port }, common.mustCall(function(res) {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', common.mustCall(function() {
      assert.strictEqual(body, 'Hello');
      server.close();
    }));
  }));
}));
