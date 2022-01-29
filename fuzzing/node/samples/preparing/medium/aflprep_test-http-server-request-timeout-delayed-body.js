'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
let sendDelayedRequestBody;
const server = createServer(common.mustCall((req, res) => {
  let body = '';
  req.setEncoding('utf-8');
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    res.write(body);
    res.end();
  });
  assert.strictEqual(typeof sendDelayedRequestBody, 'function');
  sendDelayedRequestBody();
}));
assert.strictEqual(server.requestTimeout, 0);
const requestTimeout = common.platformTimeout(1000);
server.requestTimeout = requestTimeout;
assert.strictEqual(server.requestTimeout, requestTimeout);
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  let response = '';
  client.on('data', common.mustCall((chunk) => {
    response += chunk.toString('utf-8');
  }));
  client.resume();
  client.write('Content-Length: 20\r\n');
  client.write('Connection: close\r\n');
  client.write('\r\n');
  sendDelayedRequestBody = common.mustCall(() => {
    setTimeout(() => {
      client.write('12345678901234567890\r\n\r\n');
    }, common.platformTimeout(2000)).unref();
  });
  const errOrEnd = common.mustCall(function(err) {
    console.log(err);
    assert.strictEqual(
      response,
    );
    server.close();
  });
  client.on('end', errOrEnd);
  client.on('error', errOrEnd);
}));
