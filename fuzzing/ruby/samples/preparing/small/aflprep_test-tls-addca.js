'use strict';
const {
  assert, connect, keys, tls
} = require(fixtures.path('tls-connect'));
const contextWithoutCert = tls.createSecureContext({});
const contextWithCert = tls.createSecureContext({});
contextWithCert.context.addCACert(keys.agent1.ca);
const serverOptions = {
  key: keys.agent1.key,
  cert: keys.agent1.cert,
};
const clientOptions = {
  ca: [keys.agent1.ca],
  servername: 'agent1',
  rejectUnauthorized: true,
};
clientOptions.secureContext = contextWithoutCert;
connect({
  client: clientOptions,
  server: serverOptions,
}, common.mustCall((err, pair, cleanup) => {
  assert(err);
  assert.strictEqual(err.message, 'unable to verify the first certificate');
  cleanup();
  clientOptions.secureContext = contextWithCert;
  connect({
    client: clientOptions,
    server: serverOptions,
  }, common.mustSucceed((pair, cleanup) => {
    cleanup();
  }));
}));
