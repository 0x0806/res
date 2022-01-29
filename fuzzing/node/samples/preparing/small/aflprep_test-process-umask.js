'use strict';
const assert = require('assert');
if (!common.isMainThread) {
  assert.strictEqual(typeof process.umask(), 'number');
  assert.throws(() => {
    process.umask('0664');
  }, { code: 'ERR_WORKER_UNSUPPORTED_OPERATION' });
  common.skip('Setting process.umask is not supported in Workers');
}
let mask;
if (common.isWindows) {
  mask = '0600';
} else {
  mask = '0664';
}
const old = process.umask(mask);
assert.strictEqual(process.umask(old), parseInt(mask, 8));
assert.strictEqual(process.umask(), old);
assert.strictEqual(process.umask(), old);
assert.throws(() => {
  process.umask({});
}, {
  code: 'ERR_INVALID_ARG_TYPE',
});
['123x', 'abc', '999'].forEach((value) => {
  assert.throws(() => {
    process.umask(value);
  }, {
    code: 'ERR_INVALID_ARG_VALUE',
  });
});
