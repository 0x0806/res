'use strict';
const assert = require('assert');
const { promisify } = require('util');
const execFile = require('child_process').execFile;
const echoFixture = fixtures.path('echo.js');
const promisified = promisify(execFile);
const invalidArgTypeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
};
{
  const ac = new AbortController();
  const signal = ac.signal;
  const promise = promisified(process.execPath, [echoFixture, 0], { signal });
  ac.abort();
  assert.rejects(
    promise,
    { name: 'AbortError' }
  ).then(common.mustCall());
}
{
  const signal = AbortSignal.abort();
  assert.rejects(
    promisified(process.execPath, [echoFixture, 0], { signal }),
    { name: 'AbortError' }
  ).then(common.mustCall());
}
{
  const signal = {};
  assert.throws(() => {
    promisified(process.execPath, [echoFixture, 0], { signal });
  }, invalidArgTypeError);
}
{
  const signal = 'world!';
  assert.throws(() => {
    promisified(process.execPath, [echoFixture, 0], { signal });
  }, invalidArgTypeError);
}
