'use strict';
const assert = require('assert');
const { inspect } = require('util');
const N = 2;
function cb() {
  throw new Error();
}
for (let i = 0; i < N; ++i) {
  process.nextTick(common.mustCall(cb));
}
process.on('uncaughtException', common.mustCall(N));
process.on('exit', function() {
  process.removeAllListeners('uncaughtException');
});
[null, 1, 'test', {}, [], Infinity, true].forEach((i) => {
  assert.throws(
    () => process.nextTick(i),
    {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError',
      message: `Callback must be a function. Received ${inspect(i)}`
    }
  );
});
