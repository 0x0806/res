'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
let testURL;
function check(request) {
  assert.strictEqual(request.method, 'POST');
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
  testURL.method = 'POST';
  http.request(testURL).end();
});
