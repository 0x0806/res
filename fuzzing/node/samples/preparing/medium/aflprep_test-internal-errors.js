'use strict';
const {
  hijackStdout,
  restoreStdout,
const assert = require('assert');
const { inspect } = require('util');
inspect.defaultOptions.colors = false;
errors.E('TEST_ERROR_1', 'Error for testing purposes: %s',
         Error, TypeError, RangeError);
errors.E('TEST_ERROR_2', (a, b) => `${a} ${b}`, Error);
{
  const err = new errors.codes.TEST_ERROR_1('test');
  assert(err instanceof Error);
  assert.strictEqual(err.name, 'Error');
  assert.strictEqual(err.message, 'Error for testing purposes: test');
  assert.strictEqual(err.code, 'TEST_ERROR_1');
}
{
  const err = new errors.codes.TEST_ERROR_1.TypeError('test');
  assert(err instanceof TypeError);
  assert.strictEqual(err.name, 'TypeError');
  assert.strictEqual(err.message, 'Error for testing purposes: test');
  assert.strictEqual(err.code, 'TEST_ERROR_1');
}
{
  const err = new errors.codes.TEST_ERROR_1.RangeError('test');
  assert(err instanceof RangeError);
  assert.strictEqual(err.name, 'RangeError');
  assert.strictEqual(err.message, 'Error for testing purposes: test');
  assert.strictEqual(err.code, 'TEST_ERROR_1');
}
{
  const err = new errors.codes.TEST_ERROR_2('abc', 'xyz');
  assert(err instanceof Error);
  assert.strictEqual(err.name, 'Error');
  assert.strictEqual(err.message, 'abc xyz');
  assert.strictEqual(err.code, 'TEST_ERROR_2');
}
{
  assert.throws(
    () => new errors.codes.TEST_ERROR_1(),
    {
      name: 'Error',
      code: 'ERR_INTERNAL_ASSERTION'
    }
  );
}
assert.throws(() => {
  throw new errors.codes.TEST_ERROR_1.TypeError('a');
}, { code: 'TEST_ERROR_1' });
assert.throws(() => {
  throw new errors.codes.TEST_ERROR_1.TypeError('a');
}, { code: 'TEST_ERROR_1',
     name: 'TypeError',
assert.throws(() => {
  throw new errors.codes.TEST_ERROR_1.TypeError('a');
}, { code: 'TEST_ERROR_1', name: 'TypeError' });
assert.throws(() => {
  throw new errors.codes.TEST_ERROR_1.TypeError('a');
}, {
  code: 'TEST_ERROR_1',
  name: 'TypeError',
  message: 'Error for testing purposes: a'
});
{
  const myError = new errors.codes.TEST_ERROR_1('foo');
  assert.strictEqual(myError.code, 'TEST_ERROR_1');
  assert.strictEqual(myError.hasOwnProperty('code'), true);
  assert.strictEqual(myError.hasOwnProperty('name'), false);
  assert.deepStrictEqual(Object.keys(myError), ['code']);
  const initialName = myError.name;
  myError.code = 'FHQWHGADS';
  assert.strictEqual(myError.code, 'FHQWHGADS');
  assert.strictEqual(myError.name, initialName);
  assert.deepStrictEqual(Object.keys(myError), ['code']);
  assert.ok(!myError.name.includes('TEST_ERROR_1'));
  assert.ok(!myError.name.includes('FHQWHGADS'));
}
{
  const myError = new errors.codes.TEST_ERROR_1('foo');
  assert.deepStrictEqual(Object.keys(myError), ['code']);
  const initialToString = myError.toString();
  myError.name = 'Fhqwhgads';
  assert.deepStrictEqual(Object.keys(myError), ['code', 'name']);
  assert.notStrictEqual(myError.toString(), initialToString);
}
{
  let initialConsoleLog = '';
  hijackStdout((data) => { initialConsoleLog += data; });
  const myError = new errors.codes.TEST_ERROR_1('foo');
  assert.deepStrictEqual(Object.keys(myError), ['code']);
  const initialToString = myError.toString();
  console.log(myError);
  assert.notStrictEqual(initialConsoleLog, '');
  restoreStdout();
  let subsequentConsoleLog = '';
  hijackStdout((data) => { subsequentConsoleLog += data; });
  myError.message = 'Fhqwhgads';
  assert.deepStrictEqual(Object.keys(myError), ['code']);
  assert.notStrictEqual(myError.toString(), initialToString);
  console.log(myError);
  assert.strictEqual(subsequentConsoleLog, initialConsoleLog);
  restoreStdout();
}
