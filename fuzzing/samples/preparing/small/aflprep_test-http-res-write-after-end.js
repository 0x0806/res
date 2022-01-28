'use strict';
const assert = require('assert');
const http = require('http');
const server = http.Server(common.mustCall(function(req, res) {
  res.on('error', common.expectsError({
    code: 'ERR_STREAM_WRITE_AFTER_END',
    name: 'Error'
  }));
  res.write('This should write.');
  res.end();
  const r = res.write('This should raise an error.');
  assert.strictEqual(r, false);
}));
server.listen(0, function() {
  http.get({ port: this.address().port }, function(res) {
    server.close();
  });
});
