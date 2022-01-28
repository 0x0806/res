'use strict';
const assert = require('assert');
Reflect.defineProperty(Error, 'stackTraceLimit', { get() { return 0; } });
E('ERR_TEST', 'custom message', SystemError);
const { ERR_TEST } = codes;
const ctx = {
  code: 'ETEST',
  message: 'code message',
  syscall: 'syscall_test',
};
assert.throws(
  () => { throw new ERR_TEST(ctx); },
  {
    code: 'ERR_TEST',
    name: 'SystemError',
    info: ctx,
  }
);
