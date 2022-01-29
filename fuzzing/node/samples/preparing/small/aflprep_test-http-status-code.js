'use strict';
const assert = require('assert');
const http = require('http');
const tests = [200, 202, 300, 404, 451, 500];
let test;
const countdown = new Countdown(tests.length, () => s.close());
const s = http.createServer(function(req, res) {
  console.log(`--\nserver: statusCode after writeHead: ${res.statusCode}`);
  assert.strictEqual(res.statusCode, test);
  res.end('hello world\n');
});
s.listen(0, nextTest);
function nextTest() {
  test = tests.shift();
  http.get({ port: s.address().port }, function(response) {
    console.log(`client: expected status: ${test}`);
    console.log(`client: statusCode: ${response.statusCode}`);
    assert.strictEqual(response.statusCode, test);
    response.on('end', function() {
      if (countdown.dec())
        nextTest();
    });
    response.resume();
  });
}
