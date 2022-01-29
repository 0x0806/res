'use strict';
const assert = require('assert');
const exec = require('child_process').exec;
const { promisify } = require('util');
const execPromisifed = promisify(exec);
const invalidArgTypeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
};
const waitCommand = common.isLinux ?
  'sleep 2m' :
  `${process.execPath} -e "setInterval(()=>{}, 99)"`;
{
  const ac = new AbortController();
  const signal = ac.signal;
  const promise = execPromisifed(waitCommand, { signal });
        .then(common.mustCall());
  ac.abort();
}
{
  assert.throws(() => {
    execPromisifed(waitCommand, { signal: {} });
  }, invalidArgTypeError);
}
{
  function signal() {}
  assert.throws(() => {
    execPromisifed(waitCommand, { signal });
  }, invalidArgTypeError);
}
{
  const promise = execPromisifed(waitCommand, { signal });
        .then(common.mustCall());
}
