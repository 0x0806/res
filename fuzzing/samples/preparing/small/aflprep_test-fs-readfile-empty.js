'use strict';
const fs = require('fs');
const assert = require('assert');
const fn = fixtures.path('empty.txt');
fs.readFile(fn, common.mustCall((err, data) => {
  assert.ok(data);
}));
fs.readFile(fn, 'utf8', common.mustCall((err, data) => {
  assert.strictEqual(data, '');
}));
fs.readFile(fn, { encoding: 'utf8' }, common.mustCall((err, data) => {
  assert.strictEqual(data, '');
}));
assert.ok(fs.readFileSync(fn));
assert.strictEqual(fs.readFileSync(fn, 'utf8'), '');
