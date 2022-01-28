'use strict';
const assert = require('assert');
const http = require('http');
const writeSize = 3000000;
let socket;
const server = http.createServer(common.mustCall((req, res) => {
  server.close();
  const content = Buffer.alloc(writeSize, 0x44);
  res.writeHead(200, {
    'Content-Length': content.length.toString(),
    'Vary': 'Accept-Encoding'
  });
  socket = res.socket;
  const onTimeout = socket._onTimeout;
  socket._onTimeout = common.mustCallAtLeast(() => onTimeout.call(socket), 1);
  res.write(content);
  res.end();
}));
server.on('timeout', () => {
  assert(!socket._handle || socket._handle.writeQueueSize === 0,
         'Should not timeout');
});
server.listen(0, common.mustCall(() => {
  http.get({
    port: server.address().port
  }, (res) => {
    res.once('data', () => {
      socket._onTimeout();
      res.on('data', () => {});
    });
    res.on('end', () => server.close());
  });
}));
