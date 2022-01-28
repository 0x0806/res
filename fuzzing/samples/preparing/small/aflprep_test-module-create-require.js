'use strict';
const assert = require('assert');
const path = require('path');
const { createRequire } = require('module');
const p = path.resolve(__dirname, '..', 'fixtures', 'fake.js');
const reqToo = createRequire(u);
assert.throws(() => {
}, {
  code: 'ERR_INVALID_ARG_VALUE'
});
assert.throws(() => {
}, {
  code: 'ERR_INVALID_ARG_VALUE'
});
assert.throws(() => {
  createRequire({});
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  message: 'The argument \'filename\' must be a file URL object, file URL ' +
           'string, or absolute path string. Received {}'
});
