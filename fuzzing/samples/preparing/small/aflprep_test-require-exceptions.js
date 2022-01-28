'use strict';
const assert = require('assert');
const fs = require('fs');
assert.throws(() => {
assert.throws(() => {
assert.throws(
  { code: 'MODULE_NOT_FOUND' }
);
assert.throws(
  { code: 'MODULE_NOT_FOUND' }
);
function assertExists(fixture) {
  assert(fs.existsSync(fixtures.path(fixture)));
}
