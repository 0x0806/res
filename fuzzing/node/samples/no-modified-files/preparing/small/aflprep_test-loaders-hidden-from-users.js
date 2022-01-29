'use strict';
const assert = require('assert');
assert.throws(
  () => {
  }, {
    code: 'MODULE_NOT_FOUND',
  }
);
assert.throws(
  () => {
    internalBinding('natives').owo = source;
    require('owo');
  }, {
    code: 'MODULE_NOT_FOUND',
  }
);
