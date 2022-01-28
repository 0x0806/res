'use strict';
const assert = require('assert');
const http = require('http');
{
  const { clientSide, serverSide } = MakeDuplexPair();
  const req = http.request({
    createConnection: common.mustCall(() => clientSide),
    maxHeaderSize: http.maxHeaderSize * 4
  }, common.mustCall((res) => {
    assert.strictEqual(res.headers.hello, 'A'.repeat(http.maxHeaderSize * 3));
    res.on('end', common.mustCall());
  }));
  req.end();
                 'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
                 'Content-Length: 0\r\n' +
                 '\r\n\r\n');
}
{
  const { clientSide, serverSide } = MakeDuplexPair();
  const req = http.request({
    createConnection: common.mustCall(() => clientSide)
  }, common.mustNotCall());
  req.end();
  req.on('error', common.mustCall());
                 'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
                 'Content-Length: 0\r\n' +
                 '\r\n\r\n');
}
{
  const testData = 'Hello, World!\n';
  const server = http.createServer(
    { maxHeaderSize: http.maxHeaderSize * 4 },
    common.mustCall((req, res) => {
      res.statusCode = 200;
      res.end(testData);
    }));
  server.on('clientError', common.mustNotCall());
  const { clientSide, serverSide } = MakeDuplexPair();
  serverSide.server = server;
  server.emit('connection', serverSide);
                   'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
                   '\r\n\r\n');
}
{
  const server = http.createServer(common.mustNotCall());
  server.on('clientError', common.mustCall());
  const { clientSide, serverSide } = MakeDuplexPair();
  serverSide.server = server;
  server.emit('connection', serverSide);
                   'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
                   '\r\n\r\n');
}
