'use strict';
const assert = require('assert');
process.setUncaughtExceptionCaptureCallback(common.mustNotCall());
assert.throws(
  () => require('domain'),
  {
    code: 'ERR_DOMAIN_CALLBACK_NOT_AVAILABLE',
    name: 'Error',
  }
);
process.setUncaughtExceptionCaptureCallback(null);
