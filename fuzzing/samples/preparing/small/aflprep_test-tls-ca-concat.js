'use strict';
const {
  connect, keys
} = require(fixtures.path('tls-connect'));
connect({
  client: {
    checkServerIdentity: (servername, cert) => { },
    ca: `${keys.agent1.cert}\n${keys.agent6.ca}`,
  },
  server: {
    cert: keys.agent6.cert,
    key: keys.agent6.key,
  },
}, common.mustSucceed((pair, cleanup) => {
  return cleanup();
}));
