'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const server_key = fixtures.readKey('agent1-key.pem');
const server_cert = fixtures.readKey('agent1-cert.pem');
const opts = {
  key: server_key,
  cert: server_cert,
  ciphers: 'ALL@SECLEVEL=0'
};
const server = https.createServer(opts, (req, res) => {
  res.write('hello');
}).listen(0, common.mustCall(() => {
  const client = new TestTLSSocket(server_cert);
  client.connect({
    host: 'localhost',
    port: server.address().port
  }, common.mustCall(() => {
    const ch = client.createClientHello();
    client.write(ch);
  }));
  client.once('data', common.mustCall((buf) => {
    let remaining = buf;
    do {
      remaining = client.parseTLSFrame(remaining);
    } while (remaining.length > 0);
    const cke = client.createClientKeyExchange();
    const finished = client.createFinished();
    const ill = client.createIllegalHandshake();
    const frames = Buffer.concat([
      cke,
      ccs,
      client.encrypt(finished),
      client.encrypt(ill),
    ]);
    client.write(frames, common.mustCall(() => {
      client.end();
      server.close();
    }));
  }));
}));
