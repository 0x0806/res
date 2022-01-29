'use strict';
const assert = require('assert');
const fs = require('fs');
const fn = fixtures.path('elipses.txt');
const s = fs.readFileSync(fn, 'utf8');
for (let i = 0; i < s.length; i++) {
  assert.strictEqual(s[i], '\u2026');
}
assert.strictEqual(s.length, 10000);
