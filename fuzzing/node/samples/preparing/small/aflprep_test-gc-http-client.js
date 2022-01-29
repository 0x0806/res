'use strict';
function serverHandler(req, res) {
  res.end('Hello World\n');
}
const http = require('http');
const todo = 300;
let done = 0;
let count = 0;
let countGC = 0;
console.log(`We should do ${todo} requests`);
const server = http.createServer(serverHandler);
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < 15; i++)
    getall();
}));
function getall() {
  if (count === todo)
    return;
  const req = http.get({
    hostname: 'localhost',
    port: server.address().port
  }, cb);
  count++;
  onGC(req, { ongc });
  setImmediate(getall);
}
function cb(res) {
  res.resume();
  done += 1;
}
function ongc() {
  countGC++;
}
setInterval(status, 100).unref();
function status() {
  global.gc();
  if (countGC === todo) server.close();
}
