'use strict';
const assert = require('assert');
const fs = require('fs');
if (!common.isWindows) {
  assert.fail('Windows-only test');
}
assert.throws(() => {
  fs.writeFileSync('fhqwhgads??', 'come on');
}, { code: 'EINVAL' });
