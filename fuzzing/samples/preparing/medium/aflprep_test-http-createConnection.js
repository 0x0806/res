'use strict';
const http = require('http');
const net = require('net');
const assert = require('assert');
function commonHttpGet(fn) {
  if (typeof fn === 'function') {
    fn = common.mustCall(fn);
  }
  return new Promise((resolve, reject) => {
    http.get({ createConnection: fn }, (res) => {
      resolve(res);
    }).on('error', (err) => {
      reject(err);
    });
  });
}
const server = http.createServer(common.mustCall(function(req, res) {
  res.end();
}, 4)).listen(0, '127.0.0.1', async () => {
  await commonHttpGet(createConnection);
  await commonHttpGet(createConnectionAsync);
  await commonHttpGet(createConnectionBoth1);
  await commonHttpGet(createConnectionBoth2);
  await assert.rejects(() => commonHttpGet(createConnectionError), {
    message: 'sync'
  });
  await assert.rejects(() => commonHttpGet(createConnectionAsyncError), {
    message: 'async'
  });
  server.close();
});
function createConnection() {
  return net.createConnection(server.address().port, '127.0.0.1');
}
function createConnectionAsync(options, cb) {
  setImmediate(function() {
    cb(null, net.createConnection(server.address().port, '127.0.0.1'));
  });
}
function createConnectionBoth1(options, cb) {
  const socket = net.createConnection(server.address().port, '127.0.0.1');
  setImmediate(function() {
    cb(null, socket);
  });
  return socket;
}
function createConnectionBoth2(options, cb) {
  const socket = net.createConnection(server.address().port, '127.0.0.1');
  cb(null, socket);
  return socket;
}
function createConnectionError(options, cb) {
  throw new Error('sync');
}
function createConnectionAsyncError(options, cb) {
  process.nextTick(cb, new Error('async'));
}
