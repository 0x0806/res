'use strict';
const assert = require('assert');
process.on('beforeExit', common.mustCall(function() {
  setTimeout(common.mustNotCall(), 5);
  assert.fail();
}));
