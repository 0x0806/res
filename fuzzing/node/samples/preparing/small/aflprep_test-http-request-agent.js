'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.createServer(options, function(req, res) {
  res.writeHead(200);
  res.end('hello world\n');
});
server.listen(0, common.mustCall(function() {
  console.error('listening');
  https.get({
    agent: false,
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(function(res) {
    console.error(res.statusCode, res.headers);
    res.resume();
    server.close();
  })).on('error', function(e) {
    console.error(e);
    process.exit(1);
  });
}));
