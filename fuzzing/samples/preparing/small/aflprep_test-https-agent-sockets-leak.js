'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const assert = require('assert');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  ca: fixtures.readKey('ca1-cert.pem')
};
const server = https.Server(options, common.mustCall((req, res) => {
  res.writeHead(200);
  res.end('https\n');
}));
const agent = new https.Agent({
  keepAlive: false
});
server.listen(0, common.mustCall(() => {
  https.get({
    host: server.address().host,
    port: server.address().port,
    headers: { host: 'agent1' },
    rejectUnauthorized: true,
    ca: options.ca,
    agent: agent
  }, common.mustCall((res) => {
    res.resume();
    server.close();
    assert.strictEqual(Object.keys(agent.sockets).length, 1);
    res.req.on('close', common.mustCall(() => {
      assert.strictEqual(Object.keys(agent.sockets).length, 0);
    }));
  }));
}));
