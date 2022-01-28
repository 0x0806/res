'use strict';
const assert = require('assert');
const { callbackify } = require('util');
const { execFile } = require('child_process');
const values = [
  'hello world',
  null,
  undefined,
  false,
  0,
  {},
  { key: 'value' },
  Symbol('I am a symbol'),
  function ok() {},
  ['array', 'with', 4, 'values'],
  new Error('boo'),
];
{
  for (const value of values) {
    async function asyncFn() {
      return value;
    }
    const cbAsyncFn = callbackify(asyncFn);
    cbAsyncFn(common.mustSucceed((ret) => {
      assert.strictEqual(ret, value);
    }));
    function promiseFn() {
      return Promise.resolve(value);
    }
    const cbPromiseFn = callbackify(promiseFn);
    cbPromiseFn(common.mustSucceed((ret) => {
      assert.strictEqual(ret, value);
    }));
    function thenableFn() {
      return {
        then(onRes, onRej) {
          onRes(value);
        }
      };
    }
    const cbThenableFn = callbackify(thenableFn);
    cbThenableFn(common.mustSucceed((ret) => {
      assert.strictEqual(ret, value);
    }));
  }
}
{
  for (const value of values) {
    async function asyncFn() {
      return Promise.reject(value);
    }
    const cbAsyncFn = callbackify(asyncFn);
    assert.strictEqual(cbAsyncFn.length, 1);
    assert.strictEqual(cbAsyncFn.name, 'asyncFnCallbackified');
    cbAsyncFn(common.mustCall((err, ret) => {
      assert.strictEqual(ret, undefined);
      if (err instanceof Error) {
        if ('reason' in err) {
          assert(!value);
          assert.strictEqual(err.code, 'ERR_FALSY_VALUE_REJECTION');
          assert.strictEqual(err.reason, value);
        } else {
          assert.strictEqual(String(value).endsWith(err.message), true);
        }
      } else {
        assert.strictEqual(err, value);
      }
    }));
    function promiseFn() {
      return Promise.reject(value);
    }
    const obj = {};
    Object.defineProperty(promiseFn, 'name', {
      value: obj,
      writable: false,
      enumerable: false,
      configurable: true
    });
    const cbPromiseFn = callbackify(promiseFn);
    assert.strictEqual(promiseFn.name, obj);
    cbPromiseFn(common.mustCall((err, ret) => {
      assert.strictEqual(ret, undefined);
      if (err instanceof Error) {
        if ('reason' in err) {
          assert(!value);
          assert.strictEqual(err.code, 'ERR_FALSY_VALUE_REJECTION');
          assert.strictEqual(err.reason, value);
        } else {
          assert.strictEqual(String(value).endsWith(err.message), true);
        }
      } else {
        assert.strictEqual(err, value);
      }
    }));
    function thenableFn() {
      return {
        then(onRes, onRej) {
          onRej(value);
        }
      };
    }
    const cbThenableFn = callbackify(thenableFn);
    cbThenableFn(common.mustCall((err, ret) => {
      assert.strictEqual(ret, undefined);
      if (err instanceof Error) {
        if ('reason' in err) {
          assert(!value);
          assert.strictEqual(err.code, 'ERR_FALSY_VALUE_REJECTION');
          assert.strictEqual(err.reason, value);
        } else {
          assert.strictEqual(String(value).endsWith(err.message), true);
        }
      } else {
        assert.strictEqual(err, value);
      }
    }));
  }
}
{
  for (const value of values) {
    async function asyncFn(arg) {
      assert.strictEqual(arg, value);
      return arg;
    }
    const cbAsyncFn = callbackify(asyncFn);
    assert.strictEqual(cbAsyncFn.length, 2);
    assert.notStrictEqual(
      Object.getPrototypeOf(cbAsyncFn),
      Object.getPrototypeOf(asyncFn)
    );
    assert.strictEqual(Object.getPrototypeOf(cbAsyncFn), Function.prototype);
    cbAsyncFn(value, common.mustSucceed((ret) => {
      assert.strictEqual(ret, value);
    }));
    function promiseFn(arg) {
      assert.strictEqual(arg, value);
      return Promise.resolve(arg);
    }
    const obj = {};
    Object.defineProperty(promiseFn, 'length', {
      value: obj,
      writable: false,
      enumerable: false,
      configurable: true
    });
    const cbPromiseFn = callbackify(promiseFn);
    assert.strictEqual(promiseFn.length, obj);
    cbPromiseFn(value, common.mustSucceed((ret) => {
      assert.strictEqual(ret, value);
    }));
  }
}
{
  for (const value of values) {
    const iAmThis = {
      fn(arg) {
        assert.strictEqual(this, iAmThis);
        return Promise.resolve(arg);
      },
    };
    iAmThis.cbFn = callbackify(iAmThis.fn);
    iAmThis.cbFn(value, common.mustSucceed(function(ret) {
      assert.strictEqual(ret, value);
      assert.strictEqual(this, iAmThis);
    }));
    const iAmThat = {
      async fn(arg) {
        assert.strictEqual(this, iAmThat);
        return arg;
      },
    };
    iAmThat.cbFn = callbackify(iAmThat.fn);
    iAmThat.cbFn(value, common.mustSucceed(function(ret) {
      assert.strictEqual(ret, value);
      assert.strictEqual(this, iAmThat);
    }));
  }
}
{
  const fixture = fixtures.path('uncaught-exceptions', 'callbackify1.js');
  execFile(
    process.execPath,
    [fixture],
    common.mustCall((err, stdout, stderr) => {
      assert.strictEqual(err.code, 1);
      assert.strictEqual(Object.getPrototypeOf(err).name, 'Error');
      assert.strictEqual(stdout, '');
      assert.strictEqual(errLine, `Error: ${fixture}`);
    })
  );
}
{
  const fixture = fixtures.path('uncaught-exceptions', 'callbackify2.js');
  execFile(
    process.execPath,
    [fixture],
    common.mustSucceed((stdout, stderr) => {
      assert.strictEqual(
        stdout.trim(),
        `ifError got unwanted exception: ${fixture}`);
      assert.strictEqual(stderr, '');
    })
  );
}
{
  ['foo', null, undefined, false, 0, {}, Symbol(), []].forEach((value) => {
    assert.throws(() => {
      callbackify(value);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "original" argument must be of type function.' +
               common.invalidArgTypeHelper(value)
    });
  });
}
{
  async function asyncFn() {
    return 42;
  }
  const cb = callbackify(asyncFn);
  const args = [];
  ['foo', null, undefined, false, 0, {}, Symbol(), []].forEach((value) => {
    args.push(value);
    assert.throws(() => {
      cb(...args);
    }, {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The last argument must be of type function.' +
               common.invalidArgTypeHelper(value)
    });
  });
}
