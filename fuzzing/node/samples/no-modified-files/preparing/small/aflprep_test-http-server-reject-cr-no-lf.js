'use strict';
const net = require('net');
const http = require('http');
const assert = require('assert');
            'Dummy: Header\r' +
            'Content-Length: 1\r\n' +
            '\r\n';
const server = http.createServer(common.mustNotCall());
server.on('clientError', common.mustCall((err) => {
  assert.strictEqual(err.code, 'HPE_LF_EXPECTED');
  server.close();
}));
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
