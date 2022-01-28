'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const TlsSocket = require('tls').TLSSocket;
const EventEmitter = require('events').EventEmitter;
assert.throws(
  () => { new TlsSocket(new EventEmitter()); },
  TypeError
);
