'use strict';
if (!common.hasCrypto) {
  common.skip('missing crypto');
}
const assert = require('assert');
const https = require('https');
const tls = require('tls');
const { finished } = require('stream');
const certFixture = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  ca: fixtures.readKey('ca1-cert.pem'),
};
{
  const { clientSide, serverSide } = MakeDuplexPair();
  const req = https.request({
    rejectUnauthorized: false,
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
  const req = https.request({
    rejectUnauthorized: false,
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
  const server = https.createServer(
    { insecureHTTPParser: true,
      ...certFixture },
    common.mustCall((req, res) => {
      res.statusCode = 200;
      res.end(testData);
    }));
  server.on('clientError', common.mustNotCall());
  server.listen(0, common.mustCall(() => {
    const client = tls.connect({
      port: server.address().port,
      rejectUnauthorized: false
    });
    client.write(
      'Hello: foo\x08foo\r\n' +
      '\r\n\r\n');
    client.end();
    client.on('data', () => {});
    finished(client, common.mustCall(() => {
      server.close();
    }));
  }));
}
{
  const server = https.createServer(
    { ...certFixture },
    common.mustNotCall());
  server.on('clientError', common.mustCall());
  server.listen(0, common.mustCall(() => {
    const client = tls.connect({
      port: server.address().port,
      rejectUnauthorized: false
    });
    client.write(
      'Hello: foo\x08foo\r\n' +
      '\r\n\r\n');
    client.end();
    client.on('data', () => {});
    finished(client, common.mustCall(() => {
      server.close();
    }));
  }));
}
{
  assert.throws(
    () => https.request({ insecureHTTPParser: 0 }, common.mustNotCall()),
    common.expectsError({
      code: 'ERR_INVALID_ARG_TYPE',
      message: 'The "options.insecureHTTPParser" property must be of' +
      ' type boolean. Received type number (0)'
    })
  );
}
