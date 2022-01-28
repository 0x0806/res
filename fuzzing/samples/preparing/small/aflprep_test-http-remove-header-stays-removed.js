'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(function(request, response) {
  response.removeHeader('connection');
  response.removeHeader('transfer-encoding');
  response.removeHeader('content-length');
  response.removeHeader('date');
  response.setHeader('date', 'coffee o clock');
  response.end('beep boop\n');
  this.close();
});
let response = '';
process.on('exit', function() {
  assert.strictEqual(response, 'beep boop\n');
  console.log('ok');
});
server.listen(0, function() {
  http.get({ port: this.address().port }, function(res) {
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.headers, { date: 'coffee o clock' });
    res.setEncoding('ascii');
    res.on('data', function(chunk) {
      response += chunk;
    });
  });
});
