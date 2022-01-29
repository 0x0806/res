'use strict';
const assert = require('assert');
const dgram = require('dgram');
const dns = require('dns');
{
  const lookup = common.mustCall((host, family, callback) => {
    dns.lookup(host, family, callback);
  });
  const socket = dgram.createSocket({ type: 'udp4', lookup });
  socket.bind(common.mustCall(() => {
    socket.close();
  }));
}
{
  const originalLookup = dns.lookup;
  dns.lookup = common.mustCall((host, family, callback) => {
    dns.lookup = originalLookup;
    originalLookup(host, family, callback);
  });
  const socket = dgram.createSocket({ type: 'udp4' });
  socket.bind(common.mustCall(() => {
    socket.close();
  }));
}
{
  [null, true, false, 0, 1, NaN, '', 'foo', {}, Symbol()].forEach((value) => {
    assert.throws(() => {
      dgram.createSocket({ type: 'udp4', lookup: value });
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "lookup" argument must be of type function.' +
               common.invalidArgTypeHelper(value)
    });
  });
}
