'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
               'Content-Length: 1\r\n' +
               'Transfer-Encoding: chunked\r\n\r\n';
const server = http.createServer(common.mustNotCall());
server.on('clientError', common.mustCall((err) => {
  assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
  server.close();
}));
server.listen(0, () => {
  const client = net.connect({ port: server.address().port }, () => {
    client.write(reqstr);
    client.end();
  });
  client.on('data', (data) => {
    assert.fail('no data should be returned by the server');
  });
  client.on('end', common.mustCall());
});
