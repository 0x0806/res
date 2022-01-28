'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const tlsSocketKeyLog = tls.connect('cause-error');
tlsSocketKeyLog.on('error', common.mustCall());
tlsSocketKeyLog.on('close', common.mustCall(() => {
  tlsSocketKeyLog.on('keylog', common.mustNotCall());
}));
const tlsSocketSession = tls.connect('cause-error-2');
tlsSocketSession.on('error', common.mustCall());
tlsSocketSession.on('close', common.mustCall(() => {
  tlsSocketSession.on('session', common.mustNotCall());
}));
