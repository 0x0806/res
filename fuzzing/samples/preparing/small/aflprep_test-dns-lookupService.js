'use strict';
const assert = require('assert');
const cares = internalBinding('cares_wrap');
const { UV_ENOENT } = internalBinding('uv');
cares.getnameinfo = () => UV_ENOENT;
const dns = require('dns');
assert.throws(
  () => dns.lookupService('127.0.0.1', 80, common.mustNotCall()),
  {
    code: 'ENOENT',
    message: 'getnameinfo ENOENT 127.0.0.1',
    syscall: 'getnameinfo'
  }
);
assert.rejects(
  dns.promises.lookupService('127.0.0.1', 80),
  {
    code: 'ENOENT',
    message: 'getnameinfo ENOENT 127.0.0.1',
    syscall: 'getnameinfo'
  }
);
