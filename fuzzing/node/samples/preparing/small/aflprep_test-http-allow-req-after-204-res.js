'use strict';
const http = require('http');
const assert = require('assert');
const codes = [204, 200];
const countdown = new Countdown(codes.length, () => server.close());
const server = http.createServer(common.mustCall((req, res) => {
  const code = codes.shift();
  assert.strictEqual(typeof code, 'number');
  assert.ok(code > 0);
  res.writeHead(code, {});
  res.end();
}, codes.length));
function nextRequest() {
  const request = http.get({
    port: server.address().port,
  }, common.mustCall((response) => {
    response.on('end', common.mustCall(() => {
      if (countdown.dec()) {
        nextRequest();
      }
    }));
    response.resume();
  }));
  request.end();
}
server.listen(0, nextRequest);
