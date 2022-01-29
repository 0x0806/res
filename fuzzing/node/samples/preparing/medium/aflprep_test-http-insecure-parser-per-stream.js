'use strict';
const assert = require('assert');
const http = require('http');
{
  const { clientSide, serverSide } = MakeDuplexPair();
  const req = http.request({
    createConnection: common.mustCall(() => clientSide),
    insecureHTTPParser: true
  }, common.mustCall((res) => {
    assert.strictEqual(res.headers.hello, 'foo\x08foo');
    res.on('end', common.mustCall());
  }));
  req.end();
                 'Hello: foo\x08foo\r\n' +
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
                 'Hello: foo\x08foo\r\n' +
                 'Content-Length: 0\r\n' +
                 '\r\n\r\n');
}
{
  const testData = 'Hello, World!\n';
  const server = http.createServer(
    { insecureHTTPParser: true },
    common.mustCall((req, res) => {
      res.statusCode = 200;
      res.end(testData);
    }));
  server.on('clientError', common.mustNotCall());
  const { clientSide, serverSide } = MakeDuplexPair();
  serverSide.server = server;
  server.emit('connection', serverSide);
                   'Hello: foo\x08foo\r\n' +
                   '\r\n\r\n');
}
{
  const server = http.createServer(common.mustNotCall());
  server.on('clientError', common.mustCall());
  const { clientSide, serverSide } = MakeDuplexPair();
  serverSide.server = server;
  server.emit('connection', serverSide);
                   'Hello: foo\x08foo\r\n' +
                   '\r\n\r\n');
}
{
  assert.throws(
    () => http.request({ insecureHTTPParser: 0 }, common.mustNotCall()),
    common.expectsError({
      code: 'ERR_INVALID_ARG_TYPE',
      message: 'The "options.insecureHTTPParser" property must be of' +
      ' type boolean. Received type number (0)'
    })
  );
}
