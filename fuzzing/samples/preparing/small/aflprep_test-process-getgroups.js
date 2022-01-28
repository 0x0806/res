'use strict';
if (common.isOSX)
  common.skip('Output of `id -G` is unreliable on Darwin.');
const assert = require('assert');
const exec = require('child_process').exec;
if (typeof process.getgroups === 'function') {
  const groups = unique(process.getgroups());
  assert(Array.isArray(groups));
  assert(groups.length > 0);
  exec('id -G', function(err, stdout) {
    assert.ifError(err);
    assert.deepStrictEqual(groups, real_groups);
    check(groups, real_groups);
    check(real_groups, groups);
  });
}
function check(a, b) {
  for (let i = 0; i < a.length; ++i) assert(b.includes(a[i]));
}
function unique(groups) {
  return [...new Set(groups)].sort();
}
