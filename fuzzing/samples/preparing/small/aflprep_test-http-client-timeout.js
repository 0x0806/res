'use strict';
const assert = require('assert');
const http = require('http');
const options = {
  method: 'GET',
  port: undefined,
  host: '127.0.0.1',
};
const server = http.createServer(function(req, res) {
});
server.listen(0, options.host, function() {
  options.port = this.address().port;
  const req = http.request(options, function(res) {
  });
  req.on('close', function() {
    assert.strictEqual(req.destroyed, true);
    server.close();
  });
  function destroy() {
    req.destroy();
  }
  const s = req.setTimeout(1, destroy);
  assert.ok(s instanceof http.ClientRequest);
  req.on('error', destroy);
  req.end();
});
