'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustCall(function(req, res) {
  assert.strictEqual(req.method, 'POST');
  req.setEncoding('utf8');
  let sent_body = '';
  req.on('data', function(chunk) {
    console.log(`server got: ${JSON.stringify(chunk)}`);
    sent_body += chunk;
  });
  req.on('end', common.mustCall(function() {
    assert.strictEqual(sent_body, '1\n2\n3\n');
    console.log('request complete from server');
    res.write('hello\n');
    res.end();
  }));
}));
server.listen(0);
server.on('listening', common.mustCall(function() {
  const req = http.request({
    port: this.address().port,
    method: 'POST',
  }, common.mustCall(function(res) {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log(chunk);
    });
    res.on('end', common.mustCall(function() {
      server.close();
    }));
  }));
  req.write('1\n');
  req.write('2\n');
  req.write('3\n');
  req.end();
}));
