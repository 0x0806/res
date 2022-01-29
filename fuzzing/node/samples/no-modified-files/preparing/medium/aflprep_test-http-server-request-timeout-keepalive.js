'use strict';
const assert = require('assert');
const { createServer } = require('http');
const { connect } = require('net');
function performRequestWithDelay(client, firstDelay, secondDelay) {
  client.resume();
  firstDelay = common.platformTimeout(firstDelay);
  secondDelay = common.platformTimeout(secondDelay);
  console.log('performRequestWithDelay', firstDelay, secondDelay);
  setTimeout(() => {
    client.write('Connection: ');
  }, firstDelay).unref();
  setTimeout(() => {
    client.write('keep-alive\r\n\r\n');
  }, firstDelay + secondDelay).unref();
}
const server = createServer(common.mustCallAtLeast((req, res) => {
  res.end();
}));
assert.strictEqual(server.requestTimeout, 0);
const requestTimeout = common.platformTimeout(1000);
server.requestTimeout = requestTimeout;
assert.strictEqual(server.requestTimeout, requestTimeout);
server.keepAliveTimeout = 0;
server.listen(0, common.mustCall(() => {
  const client = connect(server.address().port);
  let second = false;
  let response = '';
  client.on('data', common.mustCallAtLeast((chunk) => {
    response += chunk.toString('utf-8');
    if (!second && response.endsWith('\r\n\r\n')) {
      assert.strictEqual(
        response.split('\r\n')[0],
      );
      const defer = common.platformTimeout(server.requestTimeout * 1.5);
      console.log('defer by', defer);
      setTimeout(() => {
        response = '';
        second = true;
        performRequestWithDelay(client, 1000, 3000);
      }, defer).unref();
    }
  }, 1));
  const errOrEnd = common.mustCall(function(err) {
    console.log(err);
    assert.strictEqual(second, true);
    assert.strictEqual(
      response,
      ''
    );
    server.close();
  });
  client.on('error', errOrEnd);
  client.on('end', errOrEnd);
  performRequestWithDelay(client, 50, 500);
}));
