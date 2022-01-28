'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
let testURL;
function check(request) {
  assert.strictEqual(request.method, 'GET');
  assert.strictEqual(request.headers.host,
                     `${testURL.hostname}:${testURL.port}`);
}
const server = http.createServer(function(request, response) {
  check(request);
  response.writeHead(200, {});
  response.end('ok');
  server.close();
});
server.listen(0, function() {
  const clientRequest = http.request(testURL);
  assert.ok(clientRequest.agent instanceof http.Agent);
  clientRequest.end();
});
