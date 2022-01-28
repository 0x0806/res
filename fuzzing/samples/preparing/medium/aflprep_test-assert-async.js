'use strict';
const assert = require('assert');
const promises = [];
const invalidThenable = {
  then: (fulfill, reject) => {
    fulfill();
  },
};
const invalidThenableFunc = () => {
  function f() {}
  f.then = (fulfill, reject) => {
    fulfill();
  };
  f.catch = () => {};
  return f;
};
{
  const rejectingFn = async () => assert.fail();
  const errObj = {
    code: 'ERR_ASSERTION',
    name: 'AssertionError',
    message: 'Failed'
  };
  promises.push(assert.rejects(rejectingFn, errObj));
  promises.push(assert.rejects(rejectingFn(), errObj));
  const validRejectingThenable = {
    then: (fulfill, reject) => {
      reject({ code: 'FAIL' });
    },
    catch: () => {}
  };
  promises.push(assert.rejects(validRejectingThenable, { code: 'FAIL' }));
  promises.push(assert.rejects(
    assert.rejects(invalidThenable, {}),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    })
  );
  promises.push(assert.rejects(
    assert.rejects(invalidThenableFunc, {}),
    {
      code: 'ERR_INVALID_RETURN_VALUE'
    })
  );
  const err = new Error('foobar');
  const validate = () => { return 'baz'; };
  promises.push(assert.rejects(
    () => assert.rejects(Promise.reject(err), validate),
    {
      message: 'The "validate" validation function is expected to ' +
               "return \"true\". Received 'baz'\n\nCaught error:\n\n" +
               'Error: foobar',
      code: 'ERR_ASSERTION',
      actual: err,
      expected: validate,
      name: 'AssertionError',
      operator: 'rejects',
    }
  ));
}
{
  const handler = (err) => {
    assert(err instanceof assert.AssertionError,
           `${err.name} is not instance of AssertionError`);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.message,
                       'Missing expected rejection (mustNotCall).');
    assert.strictEqual(err.operator, 'rejects');
    assert.ok(!err.stack.includes('at Function.rejects'));
    return true;
  };
  let promise = assert.rejects(async () => {}, common.mustNotCall());
  promises.push(assert.rejects(promise, common.mustCall(handler)));
  promise = assert.rejects(() => {}, common.mustNotCall());
  promises.push(assert.rejects(promise, {
    name: 'TypeError',
    code: 'ERR_INVALID_RETURN_VALUE',
    message: 'Expected instance of Promise to be returned ' +
             'from the "promiseFn" function but got type undefined.'
  }));
  promise = assert.rejects(Promise.resolve(), common.mustNotCall());
  promises.push(assert.rejects(promise, common.mustCall(handler)));
}
{
  const THROWN_ERROR = new Error();
  promises.push(assert.rejects(() => {
    throw THROWN_ERROR;
  }, {}).catch(common.mustCall((err) => {
    assert.strictEqual(err, THROWN_ERROR);
  })));
}
promises.push(assert.rejects(
  assert.rejects('fail', {}),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    message: 'The "promiseFn" argument must be of type function or an ' +
             "instance of Promise. Received type string ('fail')"
  }
));
{
  const handler = (generated, actual, err) => {
    assert.strictEqual(err.generatedMessage, generated);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.actual, actual);
    assert.strictEqual(err.operator, 'rejects');
    return true;
  };
  const err = new Error();
  promises.push(assert.rejects(
    assert.rejects(Promise.reject(null), { code: 'FOO' }),
    handler.bind(null, true, null)
  ));
  promises.push(assert.rejects(
    assert.rejects(Promise.reject(5), { code: 'FOO' }, 'AAAAA'),
    handler.bind(null, false, 5)
  ));
  promises.push(assert.rejects(
    assert.rejects(Promise.reject(err), { code: 'FOO' }, 'AAAAA'),
    handler.bind(null, false, err)
  ));
}
{
  let promise = assert.doesNotReject(() => new Map(), common.mustNotCall());
  promises.push(assert.rejects(promise, {
    message: 'Expected instance of Promise to be returned ' +
             'from the "promiseFn" function but got instance of Map.',
    code: 'ERR_INVALID_RETURN_VALUE',
    name: 'TypeError'
  }));
  promises.push(assert.doesNotReject(async () => {}));
  promises.push(assert.doesNotReject(Promise.resolve()));
  const validFulfillingThenable = {
    then: (fulfill, reject) => {
      fulfill();
    },
    catch: () => {}
  };
  promises.push(assert.doesNotReject(validFulfillingThenable));
  promises.push(assert.rejects(
    assert.doesNotReject(invalidThenable),
    {
      code: 'ERR_INVALID_ARG_TYPE'
    })
  );
  promises.push(assert.rejects(
    assert.doesNotReject(invalidThenableFunc),
    {
      code: 'ERR_INVALID_RETURN_VALUE'
    })
  );
  const handler1 = (err) => {
    assert(err instanceof assert.AssertionError,
           `${err.name} is not instance of AssertionError`);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.message, 'Failed');
    return true;
  };
  const handler2 = (err) => {
    assert(err instanceof assert.AssertionError,
           `${err.name} is not instance of AssertionError`);
    assert.strictEqual(err.code, 'ERR_ASSERTION');
    assert.strictEqual(err.message,
                       'Got unwanted rejection.\nActual message: "Failed"');
    assert.strictEqual(err.operator, 'doesNotReject');
    assert.ok(err.stack);
    assert.ok(!err.stack.includes('at Function.doesNotReject'));
    return true;
  };
  const rejectingFn = async () => assert.fail();
  promise = assert.doesNotReject(rejectingFn, common.mustCall(handler1));
  promises.push(assert.rejects(promise, common.mustCall(handler2)));
  promise = assert.doesNotReject(rejectingFn(), common.mustCall(handler1));
  promises.push(assert.rejects(promise, common.mustCall(handler2)));
  promise = assert.doesNotReject(() => assert.fail(), common.mustNotCall());
  promises.push(assert.rejects(promise, common.mustCall(handler1)));
  promises.push(assert.rejects(
    assert.doesNotReject(123),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      message: 'The "promiseFn" argument must be of type ' +
               'function or an instance of Promise. Received type number (123)'
    }
  ));
}
Promise.all(promises).then(common.mustCall());
