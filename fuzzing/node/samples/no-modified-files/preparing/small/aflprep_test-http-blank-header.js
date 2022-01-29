'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const server = http.createServer(common.mustCall((req, res) => {
  assert.strictEqual(req.method, 'GET');
  assert.deepStrictEqual(req.headers, {
    host: 'example.org:443',
    cookie: ''
  });
}));
server.listen(0, common.mustCall(() => {
  const c = net.createConnection(server.address().port);
  let received = '';
  c.on('connect', common.mustCall(() => {
            'Host: example.org:443\r\n' +
            'Cookie:\r\n' +
            '\r\n\r\nhello world'
    );
  }));
  c.on('data', common.mustCall((data) => {
    received += data.toString();
  }));
  c.on('end', common.mustCall(() => {
    assert.strictEqual(received,
                       'Connection: close\r\n\r\n');
    c.end();
  }));
  c.on('close', common.mustCall(() => server.close()));
}));
