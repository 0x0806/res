'use strict';
const assert = require('assert');
const http = require('http');
const domain = require('domain');
let d;
tmpdir.refresh();
const server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end();
  server.close();
});
server.listen(common.PIPE, function() {
  d = domain.create();
  d.run(common.mustCall(test));
});
function test() {
  d.on('error', common.mustCall((err) => {
    assert.strictEqual(err.message, 'should be caught by domain');
  }));
  const req = http.get({
    socketPath: common.PIPE,
    headers: { 'Content-Length': '1' },
    method: 'POST',
  });
  req.on('response', function(res) {
    res.on('end', function() {
      res.emit('error', new Error('should be caught by domain'));
    });
    res.resume();
  });
  req.end();
}
