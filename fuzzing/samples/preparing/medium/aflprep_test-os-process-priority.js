'use strict';
if (common.isIBMi)
  common.skip('IBMi has a different process priority');
const assert = require('assert');
const os = require('os');
const {
  PRIORITY_LOW,
  PRIORITY_BELOW_NORMAL,
  PRIORITY_NORMAL,
  PRIORITY_ABOVE_NORMAL,
  PRIORITY_HIGH,
  PRIORITY_HIGHEST
} = os.constants.priority;
assert.strictEqual(typeof PRIORITY_LOW, 'number');
assert.strictEqual(typeof PRIORITY_BELOW_NORMAL, 'number');
assert.strictEqual(typeof PRIORITY_NORMAL, 'number');
assert.strictEqual(typeof PRIORITY_ABOVE_NORMAL, 'number');
assert.strictEqual(typeof PRIORITY_HIGH, 'number');
assert.strictEqual(typeof PRIORITY_HIGHEST, 'number');
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
  };
  assert.throws(() => {
    os.setPriority(pid, PRIORITY_NORMAL);
  }, errObj);
  assert.throws(() => {
    os.getPriority(pid);
  }, errObj);
});
[NaN, Infinity, -Infinity, 3.14, 2 ** 32].forEach((pid) => {
  const errObj = {
    code: 'ERR_OUT_OF_RANGE',
  };
  assert.throws(() => {
    os.setPriority(pid, PRIORITY_NORMAL);
  }, errObj);
  assert.throws(() => {
    os.getPriority(pid);
  }, errObj);
});
  assert.throws(() => {
    os.setPriority(0, priority);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
  });
});
[
  NaN,
  Infinity,
  -Infinity,
  3.14,
  2 ** 32,
  PRIORITY_HIGHEST - 1,
  PRIORITY_LOW + 1,
].forEach((priority) => {
  assert.throws(() => {
    os.setPriority(0, priority);
  }, {
    code: 'ERR_OUT_OF_RANGE',
  });
});
for (let i = PRIORITY_HIGHEST; i <= PRIORITY_LOW; i++) {
  try {
    os.setPriority(0, i);
  } catch (err) {
    if (err.info.code === 'EACCES')
      continue;
    assert(err);
  }
  checkPriority(0, i);
  os.setPriority(i);
  checkPriority(undefined, i);
  os.setPriority(process.pid, i);
  checkPriority(process.pid, i);
}
function checkPriority(pid, expected) {
  const priority = os.getPriority(pid);
  if (!common.isWindows) {
    assert.strictEqual(priority, expected);
    return;
  }
  if (expected < PRIORITY_HIGH)
    assert.ok(priority === PRIORITY_HIGHEST || priority === PRIORITY_HIGH);
  else if (expected < PRIORITY_ABOVE_NORMAL)
    assert.strictEqual(priority, PRIORITY_HIGH);
  else if (expected < PRIORITY_NORMAL)
    assert.strictEqual(priority, PRIORITY_ABOVE_NORMAL);
  else if (expected < PRIORITY_BELOW_NORMAL)
    assert.strictEqual(priority, PRIORITY_NORMAL);
  else if (expected < PRIORITY_LOW)
    assert.strictEqual(priority, PRIORITY_BELOW_NORMAL);
  else
    assert.strictEqual(priority, PRIORITY_LOW);
}
