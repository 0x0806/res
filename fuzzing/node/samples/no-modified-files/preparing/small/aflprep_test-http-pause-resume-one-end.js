'use strict';
const http = require('http');
const assert = require('assert');
const server = http.Server(function(req, res) {
  res.end('Hello World\n');
  server.close();
});
server.listen(0, common.mustCall(function() {
  const opts = {
    port: this.address().port,
    headers: { connection: 'close' }
  };
  http.get(opts, common.mustCall(function(res) {
    res.on('data', common.mustCall(function() {
      res.pause();
      setImmediate(function() {
        res.resume();
      });
    }));
    res.on('end', common.mustCall(() => {
      assert.strictEqual(res.destroyed, false);
    }));
    assert.strictEqual(res.destroyed, false);
    res.on('close', common.mustCall(() => {
      assert.strictEqual(res.destroyed, true);
    }));
  }));
}));
