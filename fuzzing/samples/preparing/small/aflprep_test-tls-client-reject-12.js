'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
