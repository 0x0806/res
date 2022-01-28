'use strict';
const assert = require('assert');
const http = require('http');
const kResponseDestroyed = Symbol('kResponseDestroyed');
const server = http.createServer(function(req, res) {
  req.on('data', common.mustCall(function() {
    res.destroy();
    server.emit(kResponseDestroyed);
  }));
});
server.listen(0, function() {
  const req = http.request({
    port: this.address().port,
    method: 'POST'
  });
  server.once(kResponseDestroyed, common.mustCall(function() {
    req.write('hello');
  }));
  req.on('error', common.mustCall(function(er) {
    assert.strictEqual(req.res, null);
    switch (er.code) {
      case 'ECONNRESET':
        break;
      case 'ECONNABORTED':
        break;
      case 'EPIPE':
        break;
      default:
        assert.fail(`Unexpected error code ${er.code}`);
    }
    assert.strictEqual(req.outputData.length, 0);
    server.close();
  }));
  req.on('response', common.mustNotCall());
  req.write('hello', common.mustSucceed());
});
