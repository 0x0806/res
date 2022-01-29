'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.Server(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
});
let responses = 0;
const N = 4;
const M = 4;
server.listen(0, () => {
  for (let i = 0; i < N; i++) {
    setTimeout(() => {
      for (let j = 0; j < M; j++) {
        https.get({
          port: server.address().port,
          rejectUnauthorized: false
        }, function(res) {
          res.resume();
          assert.strictEqual(res.statusCode, 200);
          if (++responses === N * M) server.close();
        }).on('error', (e) => {
          throw e;
        });
      }
    }, i);
  }
});
process.on('exit', () => {
  assert.strictEqual(responses, N * M);
});
