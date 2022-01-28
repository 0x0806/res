'use strict';
const { createServer } = require('http');
const { connect } = require('net');
let client;
const server = createServer(common.mustCall((req, res) => {
  onGC(req, { ongc: common.mustCall(() => { server.close(); }) });
  req.resume();
  req.on('end', common.mustCall(() => {
    setImmediate(() => {
      client.end();
      global.gc();
    });
  }));
  res.end('hello world');
}));
server.listen(0, common.mustCall(() => {
  client = connect(server.address().port);
  const req = [
    `Host: localhost:${server.address().port}`,
    'Connection: keep-alive',
    'Content-Length: 11',
    '',
    'hello world',
    '',
  ].join('\r\n');
  client.write(req);
  client.unref();
}));
