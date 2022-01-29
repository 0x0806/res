'use strict';
const assert = require('assert');
const {
  DTRACE_HTTP_CLIENT_REQUEST,
  DTRACE_HTTP_CLIENT_RESPONSE,
  DTRACE_HTTP_SERVER_REQUEST,
  DTRACE_HTTP_SERVER_RESPONSE,
  DTRACE_NET_SERVER_CONNECTION,
  DTRACE_NET_STREAM_END
assert.strictEqual(typeof DTRACE_HTTP_CLIENT_REQUEST, 'function');
assert.strictEqual(typeof DTRACE_HTTP_CLIENT_RESPONSE, 'function');
assert.strictEqual(typeof DTRACE_HTTP_SERVER_REQUEST, 'function');
assert.strictEqual(typeof DTRACE_HTTP_SERVER_RESPONSE, 'function');
assert.strictEqual(typeof DTRACE_NET_SERVER_CONNECTION, 'function');
assert.strictEqual(typeof DTRACE_NET_STREAM_END, 'function');
