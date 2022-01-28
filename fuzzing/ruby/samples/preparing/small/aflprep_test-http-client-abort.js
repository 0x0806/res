'use strict';
const http = require('http');
const N = 8;
const countdown = new Countdown(N, () => server.close());
const server = http.Server(common.mustCall((req, res) => {
  res.writeHead(200);
  res.write('Working on it...');
  req.on('aborted', common.mustCall(() => countdown.dec()));
}, N));
server.listen(0, common.mustCall(() => {
  const requests = [];
  const reqCountdown = new Countdown(N, () => {
    requests.forEach((req) => req.abort());
  });
  const options = { port: server.address().port };
  for (let i = 0; i < N; i++) {
    requests.push(
      http.get(options, common.mustCall((res) => {
        res.resume();
        reqCountdown.dec();
      })));
  }
}));
