'use strict';
const assert = require('assert');
const http = require('http');
const server = http.Server(function(req, res) {
  res.end('hello world\n');
});
server.listen(0, function() {
  const req = http.get({ port: this.address().port }, function(res) {
    res.on('end', function() {
      assert.strictEqual(req.end(), req);
      server.close();
    });
    res.resume();
  });
});
