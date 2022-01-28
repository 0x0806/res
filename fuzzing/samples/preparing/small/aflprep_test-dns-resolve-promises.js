'use strict';
const assert = require('assert');
const cares = internalBinding('cares_wrap');
const { UV_EPERM } = internalBinding('uv');
const dnsPromises = require('dns').promises;
cares.ChannelWrap.prototype.queryA = () => UV_EPERM;
assert.rejects(
  dnsPromises.resolve('example.org'),
  {
    code: 'EPERM',
    syscall: 'queryA',
    hostname: 'example.org'
  }
);
