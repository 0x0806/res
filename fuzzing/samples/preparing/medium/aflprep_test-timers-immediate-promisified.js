'use strict';
const assert = require('assert');
const timers = require('timers');
const { promisify } = require('util');
const child_process = require('child_process');
const setPromiseImmediate = promisify(timers.setImmediate);
const exec = promisify(child_process.exec);
assert.strictEqual(setPromiseImmediate, timerPromises.setImmediate);
process.on('multipleResolves', common.mustNotCall());
{
  const promise = setPromiseImmediate();
  promise.then(common.mustCall((value) => {
    assert.strictEqual(value, undefined);
  }));
}
{
  const promise = setPromiseImmediate('foobar');
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
  setPromiseImmediate(10, { signal })
    .then(common.mustCall(() => { ac.abort(); }))
    .then(common.mustCall());
}
{
  const signal = new NodeEventTarget();
  signal.aborted = false;
  setPromiseImmediate(0, { signal }).finally(common.mustCall(() => {
    assert.strictEqual(signal.listenerCount('abort'), 0);
  }));
}
{
  Promise.all(
    [1, '', false, Infinity].map(
      (i) => assert.rejects(setPromiseImmediate(10, i), {
        code: 'ERR_INVALID_ARG_TYPE'
      })
    )
  ).then(common.mustCall());
  Promise.all(
    [1, '', false, Infinity, null, {}].map(
      (signal) => assert.rejects(setPromiseImmediate(10, { signal }), {
        code: 'ERR_INVALID_ARG_TYPE'
      })
    )
  ).then(common.mustCall());
  Promise.all(
    [1, '', Infinity, null, {}].map(
      (ref) => assert.rejects(setPromiseImmediate(10, { ref }), {
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
