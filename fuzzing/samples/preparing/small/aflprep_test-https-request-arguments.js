'use strict';
const assert = require('assert');
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  ca: fixtures.readKey('ca1-cert.pem')
};
{
  const server = https.createServer(
    options,
    common.mustCall((req, res) => {
      res.end();
      server.close();
    })
  );
  server.listen(
    0,
    common.mustCall(() => {
      https.get(
        {
          hostname: 'localhost',
          port: server.address().port,
          rejectUnauthorized: false
        },
        common.mustCall((res) => {
          res.resume();
        })
      );
    })
  );
}
