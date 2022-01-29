'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const net = require('net');
const count = 12;
if (process.argv[2] === 'child') {
  const sockets = [];
  process.on('message', common.mustCall((m, socket) => {
    function sendClosed(id) {
      process.send({ id: id, status: 'closed' });
    }
    if (m.cmd === 'new') {
      assert(socket);
      assert(socket instanceof net.Socket, 'should be a net.Socket');
      sockets.push(socket);
    }
    if (m.cmd === 'close') {
      assert.strictEqual(socket, undefined);
      if (sockets[m.id].destroyed) {
        sendClosed(m.id);
      } else {
        sockets[m.id].once('close', sendClosed.bind(null, m.id));
        sockets[m.id].destroy();
      }
    }
  }));
} else {
  const child = fork(process.argv[1], ['child']);
  child.on('exit', common.mustCall((code, signal) => {
    if (!subprocessKilled) {
      assert.fail('subprocess died unexpectedly! ' +
                  `code: ${code} signal: ${signal}`);
    }
  }));
  const server = net.createServer();
  const sockets = [];
  server.on('connection', common.mustCall((socket) => {
    child.send({ cmd: 'new' }, socket);
    sockets.push(socket);
    if (sockets.length === count) {
      closeSockets(0);
    }
  }, count));
  const onClose = common.mustCall(count);
  server.on('listening', common.mustCall(() => {
    let j = count;
    while (j--) {
      const client = net.connect(server.address().port, '127.0.0.1');
      client.on('close', onClose);
    }
  }));
  let subprocessKilled = false;
  function closeSockets(i) {
    if (i === count) {
      subprocessKilled = true;
      server.close();
      child.kill();
      return;
    }
    child.once('message', common.mustCall((m) => {
      assert.strictEqual(m.status, 'closed');
      server.getConnections(common.mustSucceed((num) => {
        assert.strictEqual(num, count - (i + 1));
        closeSockets(i + 1);
      }));
    }));
    child.send({ id: i, cmd: 'close' });
  }
  server.on('close', common.mustCall());
  server.listen(0, '127.0.0.1');
}
