'use strict';
const assert = require('assert');
const http = require('http');
const body = 'hello world\n';
const httpServer = http.createServer(common.mustCall(function(req, res) {
  httpServer.close();
  res.on('finish', common.mustCall(function() {
    assert.strictEqual(typeof req.connection.bytesWritten, 'number');
    assert(req.connection.bytesWritten > 0);
  }));
  const chunk = '7'.repeat(1024);
  const bchunk = Buffer.from(chunk);
  for (let i = 0; i < 1024; i++) {
    res.write(chunk);
    res.write(bchunk);
    res.write(chunk, 'hex');
  }
  assert(res.connection.bytesWritten > 0);
  res.end(body);
}));
httpServer.listen(0, function() {
  http.get({ port: this.address().port });
});
