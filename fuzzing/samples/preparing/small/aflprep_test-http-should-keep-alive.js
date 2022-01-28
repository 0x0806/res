'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const SERVER_RESPONSES = [
];
const SHOULD_KEEP_ALIVE = [
];
http.globalAgent.maxSockets = 5;
const countdown = new Countdown(SHOULD_KEEP_ALIVE.length, () => server.close());
const getCountdownIndex = () => SERVER_RESPONSES.length - countdown.remaining;
const server = net.createServer(function(socket) {
  socket.write(SERVER_RESPONSES[getCountdownIndex()]);
}).listen(0, function() {
  function makeRequest() {
    const req = http.get({ port: server.address().port }, function(res) {
      assert.strictEqual(
        req.shouldKeepAlive, SHOULD_KEEP_ALIVE[getCountdownIndex()],
        `${SERVER_RESPONSES[getCountdownIndex()]} should ${
          SHOULD_KEEP_ALIVE[getCountdownIndex()] ? '' : 'not '}Keep-Alive`);
      countdown.dec();
      if (countdown.remaining) {
        makeRequest();
      }
      res.resume();
    });
  }
  makeRequest();
});
