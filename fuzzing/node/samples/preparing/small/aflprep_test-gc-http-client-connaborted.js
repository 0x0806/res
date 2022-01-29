'use strict';
const http = require('http');
const todo = 500;
let done = 0;
let count = 0;
let countGC = 0;
console.log(`We should do ${todo} requests`);
function serverHandler(req, res) {
  res.connection.destroy();
}
const server = http.createServer(serverHandler);
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < 10; i++)
    getall();
}));
function getall() {
  if (count >= todo)
    return;
  const req = http.get({
    hostname: 'localhost',
    port: server.address().port
  }, cb).on('error', cb);
  count++;
  onGC(req, { ongc });
  setImmediate(getall);
}
function cb(res) {
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
