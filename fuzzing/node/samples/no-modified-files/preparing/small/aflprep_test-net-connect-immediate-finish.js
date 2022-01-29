'use strict';
const assert = require('assert');
const net = require('net');
const {
  errorLookupMock,
  mockedErrorCode,
  mockedSysCall
const client = net.connect({
  host: addresses.INVALID_HOST,
  lookup: common.mustCall(errorLookupMock())
}, common.mustNotCall());
client.once('error', common.mustCall((error) => {
  assert.ok(!('port' in error));
  assert.ok(!('host' in error));
  assert.throws(() => { throw error; }, {
    code: mockedErrorCode,
    errno: mockedErrorCode,
    syscall: mockedSysCall,
    hostname: addresses.INVALID_HOST,
    message: 'getaddrinfo ENOTFOUND something.invalid'
  });
}));
client.end();
