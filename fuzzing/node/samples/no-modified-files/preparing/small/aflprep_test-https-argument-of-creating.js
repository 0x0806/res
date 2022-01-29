'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const tls = require('tls');
const dftProtocol = {};
{
  const server = https.createServer(opts);
  assert.strictEqual(server.ALPNProtocols.compare(dftProtocol.ALPNProtocols),
                     0);
}
{
  const mustNotCall = common.mustNotCall();
  const server = https.createServer(mustNotCall);
  assert.strictEqual(server.ALPNProtocols.compare(dftProtocol.ALPNProtocols),
                     0);
  assert.strictEqual(server.listeners('request').length, 1);
  assert.strictEqual(server.listeners('request')[0], mustNotCall);
}
{
  const server = https.createServer();
  assert.strictEqual(server.ALPNProtocols.compare(dftProtocol.ALPNProtocols),
                     0);
  assert.strictEqual(server.listeners('request').length, 0);
}
