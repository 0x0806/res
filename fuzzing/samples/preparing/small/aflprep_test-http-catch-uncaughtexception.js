'use strict';
const assert = require('assert');
const http = require('http');
const uncaughtCallback = common.mustCall(function(er) {
  assert.strictEqual(er.message, 'get did fail');
});
process.on('uncaughtException', uncaughtCallback);
const server = http.createServer(function(req, res) {
  res.end('bye');
}).listen(0, function() {
  http.get({ port: this.address().port }, function(res) {
    res.resume();
    throw new Error('get did fail');
  }).on('close', function() {
    server.close();
  });
});
