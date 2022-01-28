'use strict';
const assert = require('assert');
const net = require('net');
const connect = (opts, code, type) => {
  assert.throws(
    () => net.connect(opts),
    { code, name: type.name }
  );
};
connect({
  host: 'localhost',
  port: 0,
  localAddress: 'foobar',
}, 'ERR_INVALID_IP_ADDRESS', TypeError);
connect({
  host: 'localhost',
  port: 0,
  localPort: 'foobar',
}, 'ERR_INVALID_ARG_TYPE', TypeError);
