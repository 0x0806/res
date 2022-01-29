'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const options = {};
const server = http2.createServer(options);
assert.deepStrictEqual(Object.keys(options), []);
server.on('stream', common.mustCall((stream) => {
  const headers = {};
  const options = {};
  stream.respond(headers, options);
  assert.deepStrictEqual(Object.keys(headers), []);
  assert.deepStrictEqual(Object.keys(options), []);
  stream.end();
}));
server.listen(0, common.mustCall(() => {
  const headers = {};
  const options = {};
  const req = client.request(headers, options);
  assert.deepStrictEqual(Object.keys(headers), []);
  assert.deepStrictEqual(Object.keys(options), []);
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.close();
  }));
}));
