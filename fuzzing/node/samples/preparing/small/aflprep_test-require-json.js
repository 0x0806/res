'use strict';
const assert = require('assert');
assert.throws(function() {
  require(fixtures.path('invalid.json'));
}, {
  name: 'SyntaxError',
});
