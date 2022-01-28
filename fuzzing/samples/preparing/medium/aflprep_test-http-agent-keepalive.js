'use strict';
const assert = require('assert');
const http = require('http');
const Agent = require('_http_agent').Agent;
let name;
const agent = new Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 5,
  maxFreeSockets: 5
});
const server = http.createServer(common.mustCall((req, res) => {
    res.destroy();
    return;
    const socket = res.connection;
    setImmediate(common.mustCall(() => socket.end()));
  }
  res.end('hello world');
}, 4));
function get(path, callback) {
  return http.get({
    host: 'localhost',
    port: server.address().port,
    agent: agent,
    path: path
  }, callback).on('socket', common.mustCall(checkListeners));
}
function checkDataAndSockets(body) {
  assert.strictEqual(body.toString(), 'hello world');
  assert.strictEqual(agent.sockets[name].length, 1);
  assert.strictEqual(agent.freeSockets[name], undefined);
}
function second() {
    assert.strictEqual(req.reusedSocket, true);
    assert.strictEqual(res.statusCode, 200);
    res.on('data', checkDataAndSockets);
    res.on('end', common.mustCall(() => {
      assert.strictEqual(agent.sockets[name].length, 1);
      assert.strictEqual(agent.freeSockets[name], undefined);
      process.nextTick(common.mustCall(() => {
        assert.strictEqual(agent.sockets[name], undefined);
        assert.strictEqual(agent.freeSockets[name].length, 1);
        remoteClose();
      }));
    }));
  }));
}
function remoteClose() {
    assert.deepStrictEqual(req.reusedSocket, true);
    assert.deepStrictEqual(res.statusCode, 200);
    res.on('data', checkDataAndSockets);
    res.on('end', common.mustCall(() => {
      assert.strictEqual(agent.sockets[name].length, 1);
      assert.strictEqual(agent.freeSockets[name], undefined);
      process.nextTick(common.mustCall(() => {
        assert.strictEqual(agent.sockets[name], undefined);
        assert.strictEqual(agent.freeSockets[name].length, 1);
        setTimeout(common.mustCall(() => {
          assert.strictEqual(agent.sockets[name], undefined);
          assert.strictEqual(agent.freeSockets[name], undefined);
          remoteError();
        }), common.platformTimeout(200));
      }));
    }));
  }));
}
function remoteError() {
  req.on('error', common.mustCall((err) => {
    assert(err);
    assert.strictEqual(err.message, 'socket hang up');
    assert.strictEqual(agent.sockets[name].length, 1);
    assert.strictEqual(agent.freeSockets[name], undefined);
    setTimeout(common.mustCall(() => {
      assert.strictEqual(agent.sockets[name], undefined);
      assert.strictEqual(agent.freeSockets[name], undefined);
      server.close();
    }), common.platformTimeout(1));
  }));
}
server.listen(0, common.mustCall(() => {
  name = `localhost:${server.address().port}:`;
    assert.strictEqual(req.reusedSocket, false);
    assert.strictEqual(res.statusCode, 200);
    res.on('data', checkDataAndSockets);
    res.on('end', common.mustCall(() => {
      assert.strictEqual(agent.sockets[name].length, 1);
      assert.strictEqual(agent.freeSockets[name], undefined);
      process.nextTick(common.mustCall(() => {
        assert.strictEqual(agent.sockets[name], undefined);
        assert.strictEqual(agent.freeSockets[name].length, 1);
        second();
      }));
    }));
  }));
}));
function checkListeners(socket) {
  const callback = common.mustCall(() => {
    if (!socket.destroyed) {
      assert.strictEqual(socket.listenerCount('data'), 0);
      assert.strictEqual(socket.listenerCount('drain'), 0);
      assert.strictEqual(socket.listenerCount('error'), 1);
      assert.strictEqual(socket.listenerCount('end'), 1);
    }
    socket.off('free', callback);
    socket.off('close', callback);
  });
  assert.strictEqual(socket.listenerCount('error'), 1);
  assert.strictEqual(socket.listenerCount('end'), 2);
  socket.once('free', callback);
  socket.once('close', callback);
}
