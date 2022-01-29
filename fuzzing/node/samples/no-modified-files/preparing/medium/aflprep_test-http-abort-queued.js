'use strict';
const assert = require('assert');
const http = require('http');
let complete;
const server = http.createServer(common.mustCall((req, res) => {
  res.writeHead(200);
  res.write('foo');
  complete = complete || function() {
    res.end();
  };
}));
server.listen(0, common.mustCall(() => {
  const agent = new http.Agent({ maxSockets: 1 });
  assert.strictEqual(Object.keys(agent.sockets).length, 0);
  const options = {
    hostname: 'localhost',
    port: server.address().port,
    method: 'GET',
    agent: agent
  };
  const req1 = http.request(options);
  req1.on('response', (res1) => {
    assert.strictEqual(Object.keys(agent.sockets).length, 1);
    assert.strictEqual(Object.keys(agent.requests).length, 0);
    const req2 = http.request({
      method: 'GET',
      host: 'localhost',
      port: server.address().port,
      agent: agent
    });
    assert.strictEqual(Object.keys(agent.sockets).length, 1);
    assert.strictEqual(Object.keys(agent.requests).length, 1);
    req2.on('error', (err) => {
      assert.strictEqual(err.code, 'ECONNRESET');
    });
    req2.end();
    req2.abort();
    assert.strictEqual(Object.keys(agent.sockets).length, 1);
    assert.strictEqual(Object.keys(agent.requests).length, 1);
    res1.on('data', (chunk) => complete());
    res1.on('end', common.mustCall(() => {
      setTimeout(common.mustCall(() => {
        assert.strictEqual(Object.keys(agent.sockets).length, 0);
        assert.strictEqual(Object.keys(agent.requests).length, 0);
        server.close();
      }), 100);
    }));
  });
  req1.end();
}));
