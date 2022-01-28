'use strict';
const assert = require('assert');
['SIGTERM', null, undefined, NaN, Infinity, -Infinity].forEach((val) => {
  assert.throws(() => process.kill(val), {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "pid" argument must be of type number.' +
             common.invalidArgTypeHelper(val)
  });
});
assert.throws(() => process.kill(0, 'test'), {
  code: 'ERR_UNKNOWN_SIGNAL',
  name: 'TypeError',
  message: 'Unknown signal: test'
});
assert.throws(() => process.kill(0, 987), {
  code: 'EINVAL',
  name: 'Error',
  message: 'kill EINVAL'
});
function kill(tryPid, trySig, expectPid, expectSig) {
  let getPid;
  let getSig;
  const origKill = process._kill;
  process._kill = function(pid, sig) {
    getPid = pid;
    getSig = sig;
    process._kill = origKill;
  };
  process.kill(tryPid, trySig);
  assert.strictEqual(getPid.toString(), expectPid.toString());
  assert.strictEqual(getSig, expectSig);
}
kill(0, 'SIGHUP', 0, 1);
kill(0, undefined, 0, 15);
kill('0', 'SIGHUP', 0, 1);
kill('0', undefined, 0, 15);
kill(0, 1, 0, 1);
kill(0, 15, 0, 15);
kill(-1, 'SIGHUP', -1, 1);
kill(-1, undefined, -1, 15);
kill('-1', 'SIGHUP', -1, 1);
kill('-1', undefined, -1, 15);
kill(process.pid, 'SIGHUP', process.pid, 1);
kill(process.pid, undefined, process.pid, 15);
kill(String(process.pid), 'SIGHUP', process.pid, 1);
kill(String(process.pid), undefined, process.pid, 15);
