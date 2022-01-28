'use strict';
const { createServer } = require('http');
const { connect } = require('net');
const server = createServer(common.mustCall((req, res) => {
  req.client._events.close.forEach((fn) => { fn.bind(req)(); });
}));
server.unref();
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  const req = [
    'Content-Length: 11',
    '',
    'hello world',
  ].join('\r\n');
  client.end(req);
}));
