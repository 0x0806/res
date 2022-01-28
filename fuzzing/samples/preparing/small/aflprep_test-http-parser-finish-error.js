'use strict';
const net = require('net');
const http = require('http');
const assert = require('assert');
            'Content-Length:';
const server = http.createServer(common.mustNotCall());
server.on('clientError', common.mustCall((err, socket) => {
  assert.strictEqual(err.code, 'HPE_INVALID_EOF_STATE');
  socket.destroy();
}, 1));
server.listen(0, () => {
  const client = net.connect({ port: server.address().port }, () => {
    client.on('data', common.mustNotCall());
    client.on('end', common.mustCall(() => {
      server.close();
    }));
    client.write(str);
    client.end();
  });
});
