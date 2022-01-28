'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const conn = tls.connect(0, common.mustNotCall());
conn.on('error', common.mustCall(function() {
  conn.destroy();
}));
