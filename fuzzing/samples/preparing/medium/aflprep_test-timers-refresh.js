'use strict';
const { strictEqual, throws } = require('assert');
const { inspect } = require('util');
{
  let called = false;
  const timer = setTimeout(common.mustCall(() => {
    called = true;
  }), 1);
  timer.unref();
  setTimeout(common.mustCall(() => {
    strictEqual(called, false, 'unref()\'d timer returned before check');
  }), 1);
  strictEqual(timer.refresh(), timer);
}
{
  [null, true, false, 0, 1, NaN, '', 'foo', {}, Symbol()].forEach((cb) => {
    throws(
      () => setUnrefTimeout(cb),
      {
        code: 'ERR_INVALID_CALLBACK',
        message: `Callback must be a function. Received ${inspect(cb)}`
      }
    );
  });
}
{
  let called = false;
  const timer = setUnrefTimeout(common.mustCall(() => {
    called = true;
  }), 1);
  setUnrefTimeout(common.mustCall(() => {
    strictEqual(called, false, 'unref pooled timer returned before check');
  }), 1);
  strictEqual(timer.refresh(), timer);
}
{
  let called = false;
  const timer = setTimeout(common.mustCall(() => {
    called = true;
  }), 1);
  setTimeout(common.mustCall(() => {
    strictEqual(called, false, 'pooled timer returned before check');
  }), 1);
  strictEqual(timer.refresh(), timer);
}
{
  let called = false;
  const timer = setTimeout(common.mustCall(() => {
    if (!called) {
      called = true;
      process.nextTick(common.mustCall(() => {
        timer.refresh();
        strictEqual(timer.hasRef(), true);
      }));
    }
  }, 2), 1);
}
{
  let called = 0;
  const timer = setInterval(common.mustCall(() => {
    called += 1;
    if (called === 2) {
      clearInterval(timer);
    }
  }, 2), 1);
  setTimeout(common.mustCall(() => {
    strictEqual(called, 0, 'pooled timer returned before check');
  }), 1);
  strictEqual(timer.refresh(), timer);
}
