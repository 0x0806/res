'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const net = require('net');
if (process.argv[2] === 'child') {
  const disconnect = process.disconnect;
  process.disconnect = function() {
    disconnect.apply(this, arguments);
    process.once('disconnect', common.mustCall(disconnectIsNotAsync));
    function disconnectIsNotAsync() {}
  };
  const server = net.createServer();
  server.on('connection', function(socket) {
    socket.resume();
    process.on('disconnect', function() {
      socket.end((process.connected).toString());
    });
    socket.on('end', function() {
      server.close();
    });
    socket.write('ready');
  });
  server.on('listening', function() {
    process.send({ msg: 'ready', port: server.address().port });
  });
  server.listen(0);
} else {
  const child = fork(process.argv[1], ['child']);
  let childFlag = false;
  let parentFlag = false;
  child.on('disconnect', common.mustCall(function() {
    parentFlag = child.connected;
  }));
  child.on('exit', common.mustCall());
  child.on('message', function(obj) {
    if (obj && obj.msg === 'ready') {
      const socket = net.connect(obj.port);
      socket.on('data', function(data) {
        data = data.toString();
        if (data === 'ready') {
          child.disconnect();
          assert.throws(
            child.disconnect.bind(child),
            {
              code: 'ERR_IPC_DISCONNECTED'
            });
          return;
        }
        childFlag = (data === 'true');
      });
    }
  });
  process.on('exit', function() {
    assert.strictEqual(childFlag, false);
    assert.strictEqual(parentFlag, false);
  });
}
