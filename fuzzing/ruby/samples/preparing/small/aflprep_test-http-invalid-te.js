'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 10
Transfer-Encoding: chunked, eee
Host: hacker.exploit.com
Connection: keep-alive
Content-Length: 28
I AM A SMUGGLED REQUEST!!!
`;
const server = http.createServer(common.mustNotCall());
server.on('clientError', common.mustCall((err) => {
  assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
  server.close();
}));
server.listen(0, common.mustCall(() => {
  const client = net.connect(
    server.address().port,
    common.mustCall(() => {
    }));
}));
