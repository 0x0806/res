'use strict';
const {
  mustCall,
  mustCallAtLeast,
  platformTimeout,
const assert = require('assert');
const fork = require('child_process').fork;
const net = require('net');
const debug = require('util').debuglog('test');
const count = 12;
if (process.argv[2] === 'child') {
  const needEnd = [];
  const id = process.argv[3];
  process.on('message', mustCall((m, socket) => {
    if (!socket) return;
    debug(`[${id}] got socket ${m}`);
    socket[m](m);
    socket.resume();
    socket.on('data', mustCallAtLeast(() => {
      debug(`[${id}] socket.data ${m}`);
    }));
    socket.on('end', mustCall(() => {
      debug(`[${id}] socket.end ${m}`);
    }));
    if (m === 'write') {
      needEnd.push(socket);
    }
    socket.on('close', mustCall((had_error) => {
      debug(`[${id}] socket.close ${had_error} ${m}`);
    }));
    socket.on('finish', mustCall(() => {
      debug(`[${id}] socket finished ${m}`);
    }));
  }));
  process.on('message', mustCall((m) => {
    if (m !== 'close') return;
    debug(`[${id}] got close message`);
    needEnd.forEach((endMe, i) => {
      endMe.end('end');
    });
  }));
  process.on('disconnect', mustCall(() => {
    debug(`[${id}] process disconnect, ending`);
    needEnd.forEach((endMe, i) => {
      endMe.end('end');
    });
  }));
} else {
  const child1 = fork(process.argv[1], ['child', '1']);
  const child2 = fork(process.argv[1], ['child', '2']);
  const child3 = fork(process.argv[1], ['child', '3']);
  const server = net.createServer();
  let connected = 0;
  let closed = 0;
  server.on('connection', function(socket) {
    switch (connected % 6) {
      case 0:
        child1.send('end', socket); break;
      case 1:
        child1.send('write', socket); break;
      case 2:
        child2.send('end', socket); break;
      case 3:
        child2.send('write', socket); break;
      case 4:
        child3.send('end', socket); break;
      case 5:
        child3.send('write', socket); break;
    }
    connected += 1;
    socket.once('close', () => {
      debug(`[m] socket closed, total ${++closed}`);
    });
    if (connected === count) {
      closeServer();
    }
  });
  let disconnected = 0;
  server.on('listening', mustCall(() => {
    let j = count;
    while (j--) {
      const client = net.connect(server.address().port, '127.0.0.1');
      client.on('error', () => {
        debug('[m] CLIENT: error event');
      });
      client.on('close', mustCall(() => {
        debug('[m] CLIENT: close event');
        disconnected += 1;
      }));
      client.resume();
    }
  }));
  let closeEmitted = false;
  server.on('close', mustCall(function() {
    closeEmitted = true;
    child1.kill();
    child2.kill();
    child3.kill();
  }));
  server.listen(0, '127.0.0.1');
  function closeServer() {
    server.close();
    setTimeout(() => {
      assert(!closeEmitted);
      child1.send('close');
      child2.send('close');
      child3.disconnect();
    }, platformTimeout(200));
  }
  process.on('exit', function() {
    assert.strictEqual(server._workers.length, 0);
    assert.strictEqual(disconnected, count);
    assert.strictEqual(connected, count);
  });
}
