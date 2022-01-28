'use strict';
const assert = require('assert');
assert.throws(
  () => require(path('assert-first-line')),
  {
    name: 'AssertionError',
    message: "The expression evaluated to a falsy value:\n\n  ässört.ok('')\n"
  }
);
assert.throws(
  () => require(path('assert-long-line')),
  {
    name: 'AssertionError',
    message: "The expression evaluated to a falsy value:\n\n  assert.ok('')\n"
  }
);
