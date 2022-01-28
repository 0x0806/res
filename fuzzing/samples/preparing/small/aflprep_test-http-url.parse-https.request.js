'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const url = require('url');
const httpsOptions = {
  key: readKey('agent1-key.pem'),
  cert: readKey('agent1-cert.pem')
};
function check(request) {
  assert.ok(request.socket._secureEstablished);
}
const server = https.createServer(httpsOptions, function(request, response) {
  check(request);
  response.writeHead(200, {});
  response.end('ok');
  server.close();
});
server.listen(0, function() {
  testURL.rejectUnauthorized = false;
  const clientRequest = https.request(testURL);
  assert.ok(clientRequest.agent instanceof https.Agent);
  clientRequest.end();
});
