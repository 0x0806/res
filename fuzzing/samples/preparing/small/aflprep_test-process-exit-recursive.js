'use strict';
const assert = require('assert');
let nexits = 0;
process.on('exit', function(code) {
  assert.strictEqual(nexits++, 0);
  assert.strictEqual(code, 1);
  process.exit(0);
});
process.exit(1);
