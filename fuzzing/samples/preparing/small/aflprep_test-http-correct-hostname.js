'use strict';
const assert = require('assert');
const http = require('http');
const modules = { http };
if (common.hasCrypto) {
  const https = require('https');
  modules.https = https;
}
Object.keys(modules).forEach((module) => {
  const doNotCall = common.mustNotCall(
  );
  assert.deepStrictEqual(req[kOutHeaders].host, [
    'Host',
    'example.com`x.example.com',
  ]);
  req.abort();
});
