'use strict';
const cpus = require('os').cpus().length;
function serverHandler(req, res) {
  req.resume();
  res.end('Hello World\n');
}
const http = require('http');
let createClients = true;
let done = 0;
let count = 0;
let countGC = 0;
const server = http.createServer(serverHandler);
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < cpus; i++)
    getAll();
}));
function getAll() {
  if (createClients) {
    const req = http.get({
      hostname: 'localhost',
      port: server.address().port
    }, cb).on('error', onerror);
    count++;
    onGC(req, { ongc });
    setImmediate(getAll);
  }
}
function cb(res) {
  res.resume();
  done++;
}
function onerror(err) {
  throw err;
}
function ongc() {
  countGC++;
}
setImmediate(status);
function status() {
  if (done > 0) {
    createClients = false;
    global.gc();
    if (countGC === count) {
      server.close();
    } else {
      setImmediate(status);
    }
  } else {
    setImmediate(status);
  }
}
