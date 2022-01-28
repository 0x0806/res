'use strict';
const assert = require('assert');
const timers = require('timers');
const { promisify } = require('util');
const child_process = require('child_process');
const setPromiseTimeout = promisify(timers.setTimeout);
const exec = promisify(child_process.exec);
assert.strictEqual(setPromiseTimeout, timerPromises.setTimeout);
process.on('multipleResolves', common.mustNotCall());
{
  const promise = setPromiseTimeout(1);
  promise.then(common.mustCall((value) => {
    assert.strictEqual(value, undefined);
  }));
}
{
  const promise = setPromiseTimeout(1, 'foobar');
  promise.then(common.mustCall((value) => {
    assert.strictEqual(value, 'foobar');
  }));
}
{
  const ac = new AbortController();
  const signal = ac.signal;
    .then(common.mustCall());
  ac.abort();
}
{
    .then(common.mustCall());
}
{
  const ac = new AbortController();
  const signal = ac.signal;
  setPromiseTimeout(10, undefined, { signal })
    .then(common.mustCall(() => { ac.abort(); }))
    .then(common.mustCall());
}
{
  const signal = new NodeEventTarget();
  signal.aborted = false;
  setPromiseTimeout(0, null, { signal }).finally(common.mustCall(() => {
    assert.strictEqual(signal.listenerCount('abort'), 0);
  }));
}
{
  Promise.all(
    [1, '', false, Infinity].map(
      (i) => assert.rejects(setPromiseTimeout(10, null, i), {
        code: 'ERR_INVALID_ARG_TYPE'
      })
    )
  ).then(common.mustCall());
  Promise.all(
    [1, '', false, Infinity, null, {}].map(
      (signal) => assert.rejects(setPromiseTimeout(10, null, { signal }), {
        code: 'ERR_INVALID_ARG_TYPE'
      })
    )
  ).then(common.mustCall());
  Promise.all(
    [1, '', Infinity, null, {}].map(
      (ref) => assert.rejects(setPromiseTimeout(10, null, { ref }), {
        code: 'ERR_INVALID_ARG_TYPE'
      })
    )
  ).then(common.mustCall());
}
{
  exec(`${process.execPath} -pe "const assert = require('assert');` +
    'then(assert.fail)"').then(common.mustCall(({ stderr }) => {
    assert.strictEqual(stderr, '');
  }));
}
