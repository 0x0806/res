'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
const server = createServer(common.mustCall((req, res) => {
  req.on('end', common.mustCall(() => {
    const parser = req.socket.parser;
    assert.strictEqual(parser.incoming, req);
    process.nextTick(() => {
      assert.strictEqual(parser.incoming, null);
    });
  }));
  res.end('hello world');
}));
server.unref();
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  const req = [
    `Host: localhost:${server.address().port}`,
    'Connection: keep-alive',
    'Content-Length: 11',
    '',
    'hello world',
    '',
  ].join('\r\n');
  client.end(req);
}));
