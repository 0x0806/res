'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http = require('http');
const https = require('https');
const host = '*'.repeat(64);
const MAX_TRIES = 5;
const errCodes = ['ENOTFOUND', 'EAI_FAIL'];
function tryGet(mod, tries) {
  const req = mod.get({ host: host, port: 42 }, common.mustNotCall());
  req.on('error', common.mustCall(function(err) {
    if (err.code === 'EAGAIN' && tries < MAX_TRIES) {
      tryGet(mod, ++tries);
      return;
    }
    assert(errCodes.includes(err.code), err);
  }));
}
function tryRequest(mod, tries) {
  const req = mod.request({
    method: 'GET',
    host: host,
    port: 42
  }, common.mustNotCall());
  req.on('error', common.mustCall(function(err) {
    if (err.code === 'EAGAIN' && tries < MAX_TRIES) {
      tryRequest(mod, ++tries);
      return;
    }
    assert(errCodes.includes(err.code), err);
  }));
  req.end();
}
function test(mod) {
  tryGet(mod, 0);
  tryRequest(mod, 0);
}
if (common.hasCrypto) {
  test(https);
} else {
  common.printSkipMessage('missing crypto');
}
test(http);
