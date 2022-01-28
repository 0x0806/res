'use strict';
const http = require('http');
const assert = require('assert');
const norepeat = [
  'content-type',
  'user-agent',
  'referer',
  'host',
  'authorization',
  'proxy-authorization',
  'if-modified-since',
  'if-unmodified-since',
  'from',
  'location',
  'max-forwards',
  'retry-after',
  'etag',
  'last-modified',
  'server',
  'age',
  'expires',
];
const runCount = 2;
const server = http.createServer(function(req, res) {
  const num = req.headers['x-num'];
  if (num === '1') {
    for (const name of norepeat) {
      res.setHeader(name, ['A', 'B']);
    }
    res.setHeader('X-A', ['A', 'B']);
  } else if (num === '2') {
    const headers = {};
    for (const name of norepeat) {
      headers[name] = ['A', 'B'];
    }
    headers['X-A'] = ['A', 'B'];
    res.writeHead(200, headers);
  }
  res.end('ok');
});
server.listen(0, common.mustCall(function() {
  const countdown = new Countdown(runCount, () => server.close());
  for (let n = 1; n <= runCount; n++) {
    http.get(
      { port: this.address().port, headers: { 'x-num': n } },
      common.mustCall(function(res) {
        countdown.dec();
        for (const name of norepeat) {
          assert.strictEqual(res.headers[name], 'A');
        }
        assert.strictEqual(res.headers['x-a'], 'A, B');
      })
    );
  }
}));
