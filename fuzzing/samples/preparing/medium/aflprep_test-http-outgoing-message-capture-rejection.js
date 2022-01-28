'use strict';
const assert = require('assert');
const events = require('events');
const { createServer, request } = require('http');
events.captureRejections = true;
{
  const server = createServer(common.mustCall((req, res) => {
    const _err = new Error('kaboom');
    res.on('drain', common.mustCall(async () => {
      throw _err;
    }));
    res.socket.on('error', common.mustCall((err) => {
      assert.strictEqual(err, _err);
    }));
    while (res.write('hello')) {}
  }));
  server.listen(0, common.mustCall(() => {
    const req = request({
      method: 'GET',
      host: server.address().host,
      port: server.address().port
    });
    req.end();
    req.on('response', common.mustCall((res) => {
      res.on('aborted', common.mustCall());
      res.on('error', common.expectsError({
        code: 'ECONNRESET'
      }));
      res.resume();
      server.close();
    }));
  }));
}
{
  let _res;
  let shouldEnd = false;
  const server = createServer((req, res) => {
    _res = res;
    if (shouldEnd) {
      res.end();
    }
  });
  server.listen(0, common.mustCall(() => {
    const _err = new Error('kaboom');
    const req = request({
      method: 'POST',
      host: server.address().host,
      port: server.address().port
    });
    req.on('response', common.mustNotCall((res) => {
      res.resume();
      server.close();
    }));
    req.on('error', common.mustCall((err) => {
      server.close();
      if (_res) {
        _res.end();
      } else {
        shouldEnd = true;
      }
      assert.strictEqual(err, _err);
    }));
    req.on('drain', common.mustCall(async () => {
      throw _err;
    }));
    while (req.write('hello')) {}
  }));
}
