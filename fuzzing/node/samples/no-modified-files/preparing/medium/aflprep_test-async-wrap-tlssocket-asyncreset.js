'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const serverOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  ca: fixtures.readKey('ca1-cert.pem')
};
const server = https.createServer(
  serverOptions,
  common.mustCall((req, res) => {
    res.end('hello world\n');
  }, 2)
);
server.listen(
  0,
  common.mustCall(function() {
    const port = this.address().port;
    const clientOptions = {
      agent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: false
      }),
      port: port
    };
    const req = https.get(
      clientOptions,
      common.mustCall((res) => {
        assert.strictEqual(res.statusCode, 200);
        res.on('error', (err) => assert.fail(err));
        res.socket.on('error', (err) => assert.fail(err));
        res.resume();
        res.socket.once('free', () => {
          const req2 = https.get(
            clientOptions,
            common.mustCall((res2) => {
              assert.strictEqual(res.statusCode, 200);
              res2.on('error', (err) => assert.fail(err));
              res2.socket.on('error', (err) => assert.fail(err));
              res2.destroy();
              server.close();
            })
          );
          req2.on('error', (err) => assert.fail(err));
        });
      })
    );
    req.on('error', (err) => assert.fail(err));
  })
);
