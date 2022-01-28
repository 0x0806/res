'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
if (cluster.isWorker) {
  net.createServer((socket) => {
    socket.end('echo');
  }).listen(0, '127.0.0.1');
  net.createServer((socket) => {
    socket.end('echo');
  }).listen(0, '127.0.0.1');
} else if (cluster.isPrimary) {
  const servers = 2;
  const serverPorts = new Set();
  const testConnection = (port, cb) => {
    const socket = net.connect(port, '127.0.0.1', () => {
      let result = '';
      socket.on('data', (chunk) => { result += chunk; });
      socket.on('end', common.mustCall(() => {
        cb(result === 'echo');
        serverPorts.delete(port);
      }));
    });
  };
  const testCluster = (cb) => {
    let done = 0;
    const portsArray = Array.from(serverPorts);
    for (let i = 0; i < servers; i++) {
      testConnection(portsArray[i], (success) => {
        assert.ok(success);
        done += 1;
        if (done === servers) {
          cb();
        }
      });
    }
  };
  const startCluster = (cb) => {
    const workers = 8;
    let online = 0;
    for (let i = 0, l = workers; i < l; i++) {
      cluster.fork().on('listening', common.mustCall((address) => {
        serverPorts.add(address.port);
        online += 1;
        if (online === workers * servers) {
          cb();
        }
      }, servers));
    }
  };
  const test = (again) => {
    startCluster(common.mustCall(() => {
      testCluster(common.mustCall(() => {
        cluster.disconnect(common.mustCall(() => {
          if (again) {
            test();
          }
        }));
      }));
    }));
  };
  test(true);
}
