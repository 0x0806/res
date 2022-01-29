'use strict';
const assert = require('assert');
const http = require('http');
function explicit(req, res) {
  assert.throws(() => {
  assert.throws(() => {
    res.writeHead(200, 'OK\u010D\u010AContent-Type: gotcha\r\n');
  res.statusMessage = 'OK';
  res.end();
}
function implicit(req, res) {
  assert.throws(() => {
    res.writeHead(200);
  res.statusMessage = 'OK';
  res.end();
}
const server = http.createServer((req, res) => {
    explicit(req, res);
  } else {
    implicit(req, res);
  }
}).listen(0, common.mustCall(() => {
  const hostname = 'localhost';
  const countdown = new Countdown(2, () => server.close());
  const check = common.mustCall((res) => {
    assert.notStrictEqual(res.headers['content-type'], 'gotcha');
    countdown.dec();
  }, 2);
}));
