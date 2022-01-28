'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const util = require('util');
const TLSWrap = internalBinding('tls_wrap').TLSWrap;
util.inspect(new TLSWrap());
