'use strict';
const assert = require('assert');
const http = require('http');
const serverSockets = [];
const server = http.createServer(function(req, res) {
  if (!serverSockets.includes(req.socket)) {
    serverSockets.push(req.socket);
  }
  res.end(req.url);
});
server.listen(0, function() {
  const agent = http.Agent({
    keepAlive: true,
    maxSockets: 5,
    maxFreeSockets: 2
  });
  let closed = false;
  makeReqs(10, function(er) {
    assert.ifError(er);
    assert.strictEqual(count(agent.freeSockets), 2);
    assert.strictEqual(count(agent.sockets), 0);
    assert.strictEqual(serverSockets.length, 5);
    makeReqs(10, function(er) {
      assert.ifError(er);
      assert.strictEqual(count(agent.freeSockets), 2);
      assert.strictEqual(count(agent.sockets), 0);
      assert.strictEqual(serverSockets.length, 8);
      agent.destroy();
      server.close(function() {
        closed = true;
      });
    });
  });
  process.on('exit', function() {
    assert(closed);
    console.log('ok');
  });
  function makeReqs(n, cb) {
    for (let i = 0; i < n; i++)
      makeReq(i, then);
    function then(er) {
      if (er)
        return cb(er);
      else if (--n === 0)
        setTimeout(cb, 100);
    }
  }
  function makeReq(i, cb) {
    http.request({
      port: server.address().port,
      agent: agent
    }, function(res) {
      let data = '';
      res.setEncoding('ascii');
      res.on('data', function(c) {
        data += c;
      });
      res.on('end', function() {
        cb();
      });
    }).end();
  }
  function count(sockets) {
    return Object.keys(sockets).reduce(function(n, name) {
      return n + sockets[name].length;
    }, 0);
  }
});
