'use strict';
const http = require('http');
const assert = require('assert');
const server = http.createServer(common.mustNotCall());
server.on('clientError', common.mustCall((err, socket) => {
  assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
  socket.destroy();
}));
server.listen(0, () => {
  const req = http.get({
    port: server.address().port,
    headers: { 'Content-Length': [1, 2] }
  }, common.mustNotCall('an error should have occurred'));
  req.on('error', common.mustCall(() => {
    server.close();
  }));
});
