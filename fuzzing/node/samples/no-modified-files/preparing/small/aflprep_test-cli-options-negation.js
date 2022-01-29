'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
assertHasWarning(spawnWithFlags([]));
assertHasWarning(spawnWithFlags(['--warnings']));
assertHasNoWarning(spawnWithFlags(['--no-warnings']));
assertHasWarning(spawnWithFlags(['--no-warnings', '--warnings']));
assert(spawnWithFlags(['--no-max-http-header-size']).stderr.toString().includes(
  '--no-max-http-header-size is an invalid negation because it is not ' +
  'a boolean option',
));
assert(spawnWithFlags(['--no-i-dont-exist']).stderr.toString().includes(
  'bad option: --no-i-dont-exist',
));
function spawnWithFlags(flags) {
  return spawnSync(process.execPath, [...flags, '-e', 'new Buffer(0)']);
}
function assertHasWarning(proc) {
  assert(proc.stderr.toString().includes('Buffer() is deprecated'));
}
function assertHasNoWarning(proc) {
  assert(!proc.stderr.toString().includes('Buffer() is deprecated'));
}
