'use strict';
const http = require('http');
let onPause = null;
const server = http.createServer((req, res) => {
  if (req.method === 'GET')
    return res.end();
  res.writeHead(200);
  res.flushHeaders();
  req.on('close', common.mustCall(() => {
    req.on('end', common.mustNotCall());
  }));
  req.connection.on('pause', () => {
    res.end();
    onPause();
  });
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
    post.write(Buffer.alloc(16 * 1024).fill('X'));
    onPause = () => {
      post.end('something');
    };
  }));
  post.write('initial');
  http.request({
    agent,
    method: 'GET',
    port,
  }, common.mustCall((res) => {
    server.close();
    res.connection.end();
  })).end();
}));
