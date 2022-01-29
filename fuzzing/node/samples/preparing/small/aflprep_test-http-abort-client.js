'use strict';
const http = require('http');
let serverRes;
const server = http.Server(common.mustCall((req, res) => {
  serverRes = res;
  res.writeHead(200);
  res.write('Part of my res.');
}));
server.listen(0, common.mustCall(() => {
  http.get({
    port: server.address().port,
    headers: { connection: 'keep-alive' }
  }, common.mustCall((res) => {
    server.close();
    serverRes.destroy();
    res.resume();
    res.on('end', common.mustNotCall());
    res.on('aborted', common.mustCall());
    res.on('error', common.expectsError({
      code: 'ECONNRESET'
    }));
    res.on('close', common.mustCall());
    res.socket.on('close', common.mustCall());
  }));
}));
