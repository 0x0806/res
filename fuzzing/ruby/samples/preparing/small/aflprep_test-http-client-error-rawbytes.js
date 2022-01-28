'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
  'Content-Length: 6\r\n' +
  'Transfer-Encoding: Chunked\r\n' +
  '\r\n' +
  '6\r\nfoobar' +
  '0\r\n');
const server = net.createServer(common.mustCall((conn) => {
  conn.write(response);
}));
server.listen(0, common.mustCall(() => {
  req.end();
  req.on('error', common.mustCall((err) => {
    const reason = 'Content-Length can\'t be present with Transfer-Encoding';
    assert.strictEqual(err.message, `Parse Error: ${reason}`);
    assert(err.bytesParsed < response.length);
    assert(err.bytesParsed >= response.indexOf('Transfer-Encoding'));
    assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
    assert.strictEqual(err.reason, reason);
    assert.deepStrictEqual(err.rawPacket, response);
    server.close();
  }));
}));
