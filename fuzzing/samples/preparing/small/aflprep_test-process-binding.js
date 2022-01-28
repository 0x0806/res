'use strict';
const assert = require('assert');
assert.throws(
  function() {
    process.binding('test');
  },
);
internalBinding('buffer');
