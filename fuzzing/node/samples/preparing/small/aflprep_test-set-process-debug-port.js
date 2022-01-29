'use strict';
common.skipIfInspectorDisabled();
common.skipIfWorker();
const assert = require('assert');
const kMinPort = 1024;
const kMaxPort = 65535;
function check(value, expected) {
  process.debugPort = value;
  assert.strictEqual(process.debugPort, expected);
}
check(0, 0);
check(kMinPort, kMinPort);
check(kMinPort + 1, kMinPort + 1);
check(kMaxPort - 1, kMaxPort - 1);
check(kMaxPort, kMaxPort);
check('0', 0);
check(`${kMinPort}`, kMinPort);
check(`${kMinPort + 1}`, kMinPort + 1);
check(`${kMaxPort - 1}`, kMaxPort - 1);
check(`${kMaxPort}`, kMaxPort);
check('', 0);
check(false, 0);
check(NaN, 0);
check(Infinity, 0);
check(-Infinity, 0);
check(function() {}, 0);
check({}, 0);
check([], 0);
assert.throws(() => {
  process.debugPort = Symbol();
[
  true,
  -1,
  1,
  kMinPort - 1,
  kMaxPort + 1,
  '-1',
  '1',
  `${kMinPort - 1}`,
  `${kMaxPort + 1}`,
].forEach((value) => {
  assert.throws(() => {
    process.debugPort = value;
});
