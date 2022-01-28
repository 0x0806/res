'use strict';
const domain = require('domain').create();
const assert = require('assert');
let first = false;
domain.run(function() {
  setTimeout(() => { throw new Error('FAIL'); }, 1);
  setTimeout(() => { first = true; }, 1);
  setTimeout(() => { assert.strictEqual(first, true); }, 2);
  let i = 1e6;
  while (i--);
});
domain.once('error', common.mustCall((err) => {
  assert(err);
  assert.strictEqual(err.message, 'FAIL');
}));
