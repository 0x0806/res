'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const assert = require('assert');
const https = require('https');
const url = require('url');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.createServer(options, common.mustCall((req, res) => {
  assert.strictEqual(req.method, 'GET');
  res.write('hello\n');
  res.end();
}, 3));
server.listen(0, common.mustCall(() => {
  https.get(u, common.mustCall(() => {
    https.get(url.parse(u), common.mustCall(() => {
      https.get(new URL(u), common.mustCall(() => {
        server.close();
      }));
    }));
  }));
}));
