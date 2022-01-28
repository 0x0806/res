'use strict';
const http = require('http');
const countdown = new Countdown(10, () => server.close());
const server = http.createServer((req, res) => {
  countdown.dec();
  res.end('ok');
});
server.listen(0, common.mustCall(() => {
  for (let i = 0; i < 10; i++) {
    const options = { port: server.address().port };
    const req = http.request(options, (res) => {
      res.resume();
      res.on('end', common.mustCall(() => {
        throw new Error('gleep glorp');
      }));
    });
    req.end();
  }
}));
process.on('uncaughtException', common.mustCall(10));
