'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http = require('http');
const https = require('https');
const assert = require('assert');
const hostExpect = 'localhost';
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
for (const { mod, createServer } of [
  { mod: http, createServer: http.createServer },
  { mod: https, createServer: https.createServer.bind(null, options) },
]) {
  const server = createServer(common.mustCall((req, res) => {
    assert.strictEqual(req.headers.host, hostExpect);
    assert.strictEqual(req.headers['x-port'], `${server.address().port}`);
    res.writeHead(200);
    res.end('ok');
    server.close();
  })).listen(0, common.mustCall(() => {
    mod.globalAgent.defaultPort = server.address().port;
    mod.get({
      host: 'localhost',
      rejectUnauthorized: false,
      headers: {
        'x-port': server.address().port
      }
    }, common.mustCall((res) => {
      res.resume();
    }));
  }));
}
