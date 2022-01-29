'use strict';
const assert = require('assert');
const dns = require('dns');
const dnsPromises = dns.promises;
assert.throws(
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  }
);
assert.throws(
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  }
);
assert.throws(
  {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  }
);
