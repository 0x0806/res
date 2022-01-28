'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
assert.strictEqual(tls.DEFAULT_MAX_VERSION, 'TLSv1.3');
assert.strictEqual(tls.DEFAULT_MIN_VERSION, 'TLSv1.3');
