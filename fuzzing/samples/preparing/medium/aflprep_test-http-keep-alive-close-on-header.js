'use strict';
const assert = require('assert');
const http = require('http');
const body = 'hello world\n';
const headers = { 'connection': 'keep-alive' };
const server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Length': body.length, 'Connection': 'close' });
  res.write(body);
  res.end();
});
let connectCount = 0;
server.listen(0, function() {
  const agent = new http.Agent({ maxSockets: 1 });
  const name = agent.getName({ port: this.address().port });
  let request = http.request({
    method: 'GET',
    headers: headers,
    port: this.address().port,
    agent: agent
  }, function(res) {
    assert.strictEqual(agent.sockets[name].length, 1);
    res.resume();
  });
  request.on('socket', function(s) {
    s.on('connect', function() {
      connectCount++;
    });
  });
  request.end();
  request = http.request({
    method: 'GET',
    headers: headers,
    port: this.address().port,
    agent: agent
  }, function(res) {
    assert.strictEqual(agent.sockets[name].length, 1);
    res.resume();
  });
  request.on('socket', function(s) {
    s.on('connect', function() {
      connectCount++;
    });
  });
  request.end();
  request = http.request({
    method: 'GET',
    headers: headers,
    port: this.address().port,
    agent: agent
  }, function(response) {
    response.on('end', function() {
      assert.strictEqual(agent.sockets[name].length, 1);
      server.close();
    });
    response.resume();
  });
  request.on('socket', function(s) {
    s.on('connect', function() {
      connectCount++;
    });
  });
  request.end();
});
process.on('exit', function() {
  assert.strictEqual(connectCount, 3);
});
