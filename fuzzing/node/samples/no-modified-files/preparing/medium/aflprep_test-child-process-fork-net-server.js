'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const net = require('net');
const debug = require('util').debuglog('test');
if (process.argv[2] === 'child') {
  let serverScope;
  const onServer = (msg, server) => {
    if (msg.what !== 'server') return;
    process.removeListener('message', onServer);
    serverScope = server;
    server.on('connection', (socket) => {
      debug('CHILD: got connection');
      process.send({ what: 'connection' });
      socket.destroy();
    });
    debug('CHILD: server listening');
    process.send({ what: 'listening' });
  };
  process.on('message', onServer);
  const onClose = (msg) => {
    if (msg.what !== 'close') return;
    process.removeListener('message', onClose);
    serverScope.on('close', common.mustCall(() => {
      process.send({ what: 'close' });
    }));
    serverScope.close();
  };
  process.on('message', onClose);
  process.send({ what: 'ready' });
} else {
  const child = fork(process.argv[1], ['child']);
  child.on('exit', common.mustCall((code, signal) => {
    const message = `CHILD: died with ${code}, ${signal}`;
    assert.strictEqual(code, 0, message);
  }));
  function testServer(callback) {
    const countdown = new Countdown(2, () => {
      server.on('close', common.mustCall(() => {
        debug('PARENT: server closed');
        child.send({ what: 'close' });
      }));
      server.close();
    });
    const connections = new Countdown(4, () => countdown.dec());
    const closed = new Countdown(4, () => countdown.dec());
    const server = net.createServer();
    server.on('connection', (socket) => {
      debug('PARENT: got connection');
      socket.destroy();
      connections.dec();
    });
    server.on('listening', common.mustCall(() => {
      debug('PARENT: server listening');
      child.send({ what: 'server' }, server);
    }));
    server.listen(0);
    const messageHandlers = (msg) => {
      if (msg.what === 'listening') {
        let socket;
        for (let i = 0; i < 4; i++) {
          socket = net.connect(server.address().port, common.mustCall(() => {
            debug('CLIENT: connected');
          }));
          socket.on('close', common.mustCall(() => {
            closed.dec();
            debug('CLIENT: closed');
          }));
        }
      } else if (msg.what === 'connection') {
        connections.dec();
      } else if (msg.what === 'close') {
        child.removeListener('message', messageHandlers);
        callback();
      }
    };
    child.on('message', messageHandlers);
  }
  const onReady = common.mustCall((msg) => {
    if (msg.what !== 'ready') return;
    child.removeListener('message', onReady);
    testServer(common.mustCall());
  });
  child.on('message', onReady);
}
