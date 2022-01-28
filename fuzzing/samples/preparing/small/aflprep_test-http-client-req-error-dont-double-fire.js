'use strict';
const assert = require('assert');
const http = require('http');
const host = addresses.INVALID_HOST;
const req = http.get({
  host,
  lookup: common.mustCall(errorLookupMock())
});
const err = new Error('mock unexpected code error');
req.on('error', common.mustCall(() => {
  throw err;
}));
process.on('uncaughtException', common.mustCall((e) => {
  assert.strictEqual(e, err);
}));
