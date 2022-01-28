'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
tls.createSecurePair(null, false, false, false);
tls.createSecurePair(null, true, false, false);
