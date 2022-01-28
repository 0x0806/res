'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
test(204);
test(304);
function test(statusCode) {
  const server = http.createServer(common.mustCall((req, res) => {
    res.writeHead(statusCode, { 'Transfer-Encoding': 'chunked' });
    res.end();
    server.close();
  }));
  server.listen(0, common.mustCall(() => {
    const conn = net.createConnection(
      server.address().port,
      common.mustCall(() => {
        let resp = '';
        conn.setEncoding('utf8');
        conn.on('data', common.mustCall((data) => {
          resp += data;
        }));
        conn.on('end', common.mustCall(() => {
        }));
      })
    );
  }));
}
