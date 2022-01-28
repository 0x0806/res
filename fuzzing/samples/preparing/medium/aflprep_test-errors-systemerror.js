'use strict';
const assert = require('assert');
assert.throws(
  () => { new SystemError(); },
  {
    name: 'TypeError',
    message: 'String.prototype.match called on null or undefined'
  }
);
E('ERR_TEST', 'custom message', SystemError);
const { ERR_TEST } = codes;
{
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
      message: 'custom message: syscall_test returned ETEST (code message)' +
      info: ctx
    }
  );
}
{
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
      message: 'custom message: syscall_test returned ETEST (code message)' +
      info: ctx
    }
  );
}
{
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
      message: 'custom message: syscall_test returned ETEST (code message)' +
      info: ctx
    }
  );
}
{
  const ctx = {
    code: 'ERR',
    errno: 123,
    message: 'something happened',
    syscall: 'syscall_test',
    path: Buffer.from('a'),
    dest: Buffer.from('b')
  };
  const err = new ERR_TEST(ctx);
  assert.strictEqual(err.info, ctx);
  assert.strictEqual(err.code, 'ERR_TEST');
  err.code = 'test';
  assert.strictEqual(err.code, 'test');
  assert.strictEqual(err.errno, 123);
  assert.strictEqual(err.syscall, 'syscall_test');
  assert.strictEqual(err.path, 'a');
  assert.strictEqual(err.dest, 'b');
  err.code = 'test';
  err.errno = 321;
  err.syscall = 'test';
  err.path = 'path';
  err.dest = 'path';
  assert.strictEqual(err.errno, 321);
  assert.strictEqual(err.syscall, 'test');
  assert.strictEqual(err.path, 'path');
  assert.strictEqual(err.dest, 'path');
}
{
  const ctx = {
    code: 'ERR_TEST',
    message: 'Error occurred',
    syscall: 'syscall_test'
  };
  assert.throws(
    () => {
      const err = new ERR_TEST(ctx);
      err.name = 'Foobar';
      throw err;
    },
    {
      code: 'ERR_TEST',
      name: 'Foobar',
      message: 'custom message: syscall_test returned ERR_TEST ' +
               '(Error occurred)',
      info: ctx
    }
  );
}
