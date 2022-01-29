'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { createServer } = require('https');
const { connect } = require('tls');
const { finished } = require('stream');
const headers =
  'Host: localhost\r\n' +
  'Agent: node\r\n';
const server = createServer({
  key: readKey('agent1-key.pem'),
  cert: readKey('agent1-cert.pem'),
  ca: readKey('ca1-cert.pem'),
}, common.mustNotCall());
let sendCharEvery = 1000;
assert.strictEqual(server.headersTimeout, 60 * 1000);
if (!process.env.REAL) {
  sendCharEvery = common.platformTimeout(10);
  server.headersTimeout = 2 * sendCharEvery;
}
server.once('timeout', common.mustCall((socket) => {
  socket.destroy();
}));
server.listen(0, common.mustCall(() => {
  const client = connect({
    port: server.address().port,
    rejectUnauthorized: false
  });
  client.write(headers);
  client.write('X-CRASH: ');
  const interval = setInterval(() => {
    client.write('a');
  }, sendCharEvery);
  client.resume();
  finished(client, common.mustCall((err) => {
    clearInterval(interval);
    server.close();
  }));
}));
