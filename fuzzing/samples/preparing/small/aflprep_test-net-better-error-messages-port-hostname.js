'use strict';
const assert = require('assert');
const net = require('net');
const {
  errorLookupMock,
  mockedErrorCode
const c = net.createConnection({
  port: 0,
  host: addresses.INVALID_HOST,
  lookup: common.mustCall(errorLookupMock())
});
c.on('connect', common.mustNotCall());
c.on('error', common.mustCall((error) => {
  assert.ok(!('port' in error));
  assert.ok(!('host' in error));
  assert.throws(() => { throw error; }, {
    errno: mockedErrorCode,
    code: mockedErrorCode,
    name: 'Error',
    message: 'getaddrinfo ENOTFOUND something.invalid',
    hostname: addresses.INVALID_HOST,
    syscall: 'getaddrinfo'
  });
}));
