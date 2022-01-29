'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
let sendDelayedRequestHeaders;
const server = createServer(common.mustNotCall());
server.on('connection', common.mustCall(() => {
  assert.strictEqual(typeof sendDelayedRequestHeaders, 'function');
  sendDelayedRequestHeaders();
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
  const errOrEnd = common.mustCall(function(err) {
    console.log(err);
    assert.strictEqual(
      response,
    );
    server.close();
  });
  client.on('end', errOrEnd);
  client.on('error', errOrEnd);
  client.resume();
  sendDelayedRequestHeaders = common.mustCall(() => {
    setTimeout(() => {
      client.write('Content-Length: 20\r\n');
      client.write('Connection: close\r\n\r\n');
      client.write('12345678901234567890\r\n\r\n');
    }, common.platformTimeout(2000)).unref();
  });
}));
