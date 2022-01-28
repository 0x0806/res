'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustCall((req, res) => {
  res.end('Hello World\n');
}, 2)).listen(0, common.mustCall(() => {
  const agent = new http.Agent({ maxSockets: 1 });
  agent.on('free', common.mustCall(3));
  const requestOptions = {
    agent: agent,
    host: 'localhost',
    port: server.address().port,
  };
  const request1 = http.get(requestOptions, common.mustCall((response) => {
    const key = agent.getName(requestOptions);
    assert.strictEqual(agent.requests[key].length, 1);
    response.resume();
    response.on('end', common.mustCall(() => {
      request1.socket.destroy();
      request1.socket.once('close', common.mustCall(() => {
        assert(!agent.requests[key]);
        process.nextTick(() => {
          assert.notStrictEqual(request1.socket, request2.socket);
          assert(!request2.socket.destroyed, 'the socket is destroyed');
        });
      }));
    }));
  }));
  const request2 = http.get(requestOptions, common.mustCall((response) => {
    assert(!request2.socket.destroyed);
    assert(request1.socket.destroyed);
    assert.notStrictEqual(request1.socket, request2.socket);
    const countdown = new Countdown(2, () => server.close());
    request2.socket.on('close', common.mustCall(() => countdown.dec()));
    response.on('end', common.mustCall(() => countdown.dec()));
    response.resume();
  }));
}));
