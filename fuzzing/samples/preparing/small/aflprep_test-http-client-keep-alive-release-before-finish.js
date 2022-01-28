'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  res.end();
}).listen(0, common.mustCall(() => {
  const agent = new http.Agent({
    maxSockets: 1,
    keepAlive: true
  });
  const port = server.address().port;
  const post = http.request({
    agent,
    method: 'POST',
    port,
  }, common.mustCall((res) => {
    res.resume();
  }));
  post.write(Buffer.alloc(16 * 1024, 'X'));
  setTimeout(() => {
    post.end('something');
  }, 100);
  http.request({
    agent,
    method: 'GET',
    port,
  }, common.mustCall((res) => {
    server.close();
    res.connection.end();
  })).end();
}));
