'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
tmpdir.refresh();
const https = require('https');
const options = {
  cert: fixtures.readKey('rsa_cert.crt'),
  key: fixtures.readKey('rsa_private.pem')
};
const server = https.createServer(options, common.mustCall((req, res) => {
  res.end('bye\n');
  server.close();
}));
server.listen(common.PIPE, common.mustCall(() => {
  https.get({
    socketPath: common.PIPE,
    rejectUnauthorized: false
  });
}));
