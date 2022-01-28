'use strict';
if (!common.hasCrypto) {
  common.skip('missing crypto');
}
const assert = require('assert');
const https = require('https');
const http = require('http');
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
  const req = https.request({
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
  const server = https.createServer(
    { maxHeaderSize: http.maxHeaderSize * 4,
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
      'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
      '\r\n\r\n');
    client.end();
    client.on('data', () => {});
    finished(client, common.mustCall(() => {
      server.close();
    }));
  }));
}
{
  const server = https.createServer({ ...certFixture }, common.mustNotCall());
  server.on('clientError', common.mustCallAtLeast(() => {}, 1));
  server.listen(0, common.mustCall(() => {
    const client = tls.connect({
      port: server.address().port,
      rejectUnauthorized: false
    });
    client.write(
      'Hello: ' + 'A'.repeat(http.maxHeaderSize * 3) + '\r\n' +
      '\r\n\r\n');
    client.end();
    client.on('data', () => {});
    finished(client, common.mustCall(() => {
      server.close();
    }));
  }));
}
