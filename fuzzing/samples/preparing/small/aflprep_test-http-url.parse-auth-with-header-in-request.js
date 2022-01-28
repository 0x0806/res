'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
function check(request) {
  assert.strictEqual(request.headers.authorization, 'NoAuthForYOU');
}
const server = http.createServer(function(request, response) {
  check(request);
  response.writeHead(200, {});
  response.end('ok');
  server.close();
});
server.listen(0, function() {
  const testURL =
  testURL.headers = {
    Authorization: 'NoAuthForYOU'
  };
  http.request(testURL).end();
});
