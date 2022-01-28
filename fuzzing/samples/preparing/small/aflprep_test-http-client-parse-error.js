'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
const countdown = new Countdown(2, () => server.close());
const payloads = [
  'bad http = should trigger parse error',
];
const server =
  net.createServer(common.mustCall((c) => c.end(payloads.shift()), 2));
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < 2; i++) {
    const req = http.get({
      port: server.address().port,
    }).on('error', common.mustCall((e) => {
      assert.strictEqual(req.socket.listenerCount('data'), 0);
      assert.strictEqual(req.socket.listenerCount('end'), 1);
      common.expectsError({
        code: 'HPE_INVALID_CONSTANT',
      })(e);
      countdown.dec();
    }));
  }
}));
