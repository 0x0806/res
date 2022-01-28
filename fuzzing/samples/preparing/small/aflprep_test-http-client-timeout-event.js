'use strict';
const assert = require('assert');
const http = require('http');
const options = {
  method: 'GET',
  port: undefined,
  host: '127.0.0.1',
};
const server = http.createServer();
server.listen(0, options.host, function() {
  options.port = this.address().port;
  const req = http.request(options);
  req.on('error', function() {
  });
  req.on('close', common.mustCall(() => {
    assert.strictEqual(req.destroyed, true);
    server.close();
  }));
  req.setTimeout(1);
  req.on('timeout', common.mustCall(() => {
    req.end(() => {
      setTimeout(() => {
        req.destroy();
      }, 100);
    });
  }));
});
