'use strict';
if (common.isWindows)
  common.skip('Sending dgram sockets to child processes is not supported');
const dgram = require('dgram');
const fork = require('child_process').fork;
const assert = require('assert');
if (process.argv[2] === 'child') {
  let childServer;
  process.once('message', (msg, clusterServer) => {
    childServer = clusterServer;
    childServer.once('message', () => {
      process.send('gotMessage');
      childServer.close();
    });
    process.send('handleReceived');
  });
} else {
  const parentServer = dgram.createSocket('udp4');
  const client = dgram.createSocket('udp4');
  const child = fork(__filename, ['child']);
  const msg = Buffer.from('Some bytes');
  let childGotMessage = false;
  let parentGotMessage = false;
  parentServer.once('message', (msg, rinfo) => {
    parentGotMessage = true;
    parentServer.close();
  });
  parentServer.on('listening', () => {
    child.send('server', parentServer);
    child.on('message', (msg) => {
      if (msg === 'gotMessage') {
        childGotMessage = true;
      } else if (msg === 'handleReceived') {
        sendMessages();
      }
    });
  });
  function sendMessages() {
    const serverPort = parentServer.address().port;
    const timer = setInterval(() => {
      if (parentGotMessage && childGotMessage) {
        clearInterval(timer);
        client.close();
      } else {
        client.send(
          msg,
          0,
          msg.length,
          serverPort,
          '127.0.0.1',
          (err) => {
            assert.ifError(err);
          }
        );
      }
    }, 1);
  }
  parentServer.bind(0, '127.0.0.1');
  process.once('exit', () => {
    assert(parentGotMessage);
    assert(childGotMessage);
  });
}
