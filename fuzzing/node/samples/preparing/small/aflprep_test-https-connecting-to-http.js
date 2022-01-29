'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http = require('http');
const https = require('https');
const server = http.createServer(common.mustNotCall());
server.listen(0, common.mustCall(function() {
  const req = https.get({ port: this.address().port }, common.mustNotCall());
  req.on('error', common.mustCall(function(e) {
    console.log('Got expected error: ', e.message);
    server.close();
  }));
}));
