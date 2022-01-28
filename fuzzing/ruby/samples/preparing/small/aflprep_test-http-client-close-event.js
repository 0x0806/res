'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustNotCall());
server.listen(0, common.mustCall(() => {
  const req = http.get({ port: server.address().port }, common.mustNotCall());
  let errorEmitted = false;
  req.on('error', common.mustCall((err) => {
    errorEmitted = true;
    assert.strictEqual(err.constructor, Error);
    assert.strictEqual(err.message, 'socket hang up');
    assert.strictEqual(err.code, 'ECONNRESET');
  }));
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.destroyed, true);
    assert.strictEqual(errorEmitted, true);
    server.close();
  }));
  req.destroy();
}));
