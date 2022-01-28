'use strict';
const assert = require('assert');
const http = require('http');
let requests = 0;
let responses = 0;
const headers = {};
const N = 100;
for (let i = 0; i < N; ++i) {
  headers[`key${i}`] = i;
}
  [50, 50],
  [1500, 102],
];
let max = maxAndExpected[requests][0];
let expected = maxAndExpected[requests][1];
const server = http.createServer(function(req, res) {
  assert.strictEqual(Object.keys(req.headers).length, expected);
  if (++requests < maxAndExpected.length) {
    max = maxAndExpected[requests][0];
    expected = maxAndExpected[requests][1];
    server.maxHeadersCount = max;
  }
  res.writeHead(200, headers);
  res.end();
});
server.maxHeadersCount = max;
server.listen(0, function() {
    [20, 20],
    [1200, 103],
  ];
  doRequest();
  function doRequest() {
    const max = maxAndExpected[responses][0];
    const expected = maxAndExpected[responses][1];
    const req = http.request({
      port: server.address().port,
      headers: headers
    }, function(res) {
      assert.strictEqual(Object.keys(res.headers).length, expected);
      res.on('end', function() {
        if (++responses < maxAndExpected.length) {
          doRequest();
        } else {
          server.close();
        }
      });
      res.resume();
    });
    req.maxHeadersCount = max;
    req.end();
  }
});
process.on('exit', function() {
  assert.strictEqual(requests, maxAndExpected.length);
  assert.strictEqual(responses, maxAndExpected.length);
});
