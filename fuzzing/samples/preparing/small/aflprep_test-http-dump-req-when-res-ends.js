'use strict';
const fs = require('fs');
const http = require('http');
const { strictEqual } = require('assert');
const server = http.createServer(mustCall(function(req, res) {
  strictEqual(req.socket.listenerCount('data'), 1);
  req.socket.once('data', mustCall(function() {
    res.end('hello world');
  }));
  req.on('resume', mustCall(function() {
    strictEqual(req.listenerCount('data'), 0);
    req.on('data', mustCall());
  }));
  req.pause();
  req.on('data', function() {});
  res.flushHeaders();
}));
server.listen(0, mustCall(function() {
  const req = http.request({
    method: 'POST',
    port: server.address().port
  });
  req.flushHeaders();
  req.on('response', mustCall(function(res) {
    fs.createReadStream(__filename).pipe(req);
    res.resume();
    res.on('close', function() {
      server.close();
    });
  }));
  req.on('error', function() {
  });
}));
