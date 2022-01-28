'use strict';
const {
  mustCall,
  mustCallAtLeast,
const assert = require('assert');
const fork = require('child_process').fork;
const net = require('net');
const debug = require('util').debuglog('test');
if (process.argv[2] === 'child') {
  const onSocket = mustCall((msg, socket) => {
    if (msg.what !== 'socket') return;
    process.removeListener('message', onSocket);
    socket.end('echo');
    debug('CHILD: got socket');
  });
  process.on('message', onSocket);
  process.send({ what: 'ready' });
} else {
  const child = fork(process.argv[1], ['child']);
  child.on('exit', mustCall((code, signal) => {
    const message = `CHILD: died with ${code}, ${signal}`;
    assert.strictEqual(code, 0, message);
  }));
  function testSocket() {
    const server = net.createServer();
    server.on('connection', mustCall((socket) => {
      socket.on('close', () => {
        debug('CLIENT: socket closed');
      });
      child.send({ what: 'socket' }, socket);
    }));
    server.on('close', mustCall(() => {
      debug('PARENT: server closed');
    }));
    server.listen(0, mustCall(() => {
      debug('testSocket, listening');
      const connect = net.connect(server.address().port);
      let store = '';
      connect.on('data', mustCallAtLeast((chunk) => {
        store += chunk;
        debug('CLIENT: got data');
      }));
      connect.on('close', mustCall(() => {
        debug('CLIENT: closed');
        assert.strictEqual(store, 'echo');
        server.close();
      }));
    }));
  }
  const onReady = mustCall((msg) => {
    if (msg.what !== 'ready') return;
    child.removeListener('message', onReady);
    testSocket();
  });
  child.on('message', onReady);
}
