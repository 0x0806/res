'use strict';
const assert = require('assert');
const net = require('net');
assert.throws(() => {
  net.connect();
}, {
  code: 'ERR_MISSING_ARGS',
  message: 'The "options" or "port" or "path" argument must be specified',
});
assert.throws(() => {
  new net.Socket().connect();
}, {
  code: 'ERR_MISSING_ARGS',
  message: 'The "options" or "port" or "path" argument must be specified',
});
assert.throws(() => {
  net.connect({});
}, {
  code: 'ERR_MISSING_ARGS',
  message: 'The "options" or "port" or "path" argument must be specified',
});
assert.throws(() => {
  new net.Socket().connect({});
}, {
  code: 'ERR_MISSING_ARGS',
  message: 'The "options" or "port" or "path" argument must be specified',
});
