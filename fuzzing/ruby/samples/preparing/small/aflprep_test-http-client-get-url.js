'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
const server = http.createServer(common.mustCall((req, res) => {
  assert.strictEqual(req.method, 'GET');
  assert.strictEqual(req.url, testPath);
  res.write('hello\n');
  res.end();
}, 3));
server.listen(0, common.localhostIPv4, common.mustCall(() => {
  http.get(u, common.mustCall(() => {
    http.get(url.parse(u), common.mustCall(() => {
      http.get(new URL(u), common.mustCall(() => {
        server.close();
      }));
    }));
  }));
}));
