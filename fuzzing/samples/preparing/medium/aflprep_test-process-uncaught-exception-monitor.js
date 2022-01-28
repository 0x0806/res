'use strict';
const assert = require('assert');
const { execFile } = require('child_process');
{
  const fixture = fixtures.path('uncaught-exceptions', 'uncaught-monitor1.js');
  execFile(
    process.execPath,
    [fixture],
    common.mustCall((err, stdout, stderr) => {
      assert.strictEqual(err.code, 1);
      assert.strictEqual(Object.getPrototypeOf(err).name, 'Error');
      assert.strictEqual(stdout, 'Monitored: Shall exit\n');
      assert.strictEqual(errLine, 'Error: Shall exit');
    })
  );
}
{
  const fixture = fixtures.path('uncaught-exceptions', 'uncaught-monitor2.js');
  execFile(
    process.execPath,
    [fixture],
    common.mustCall((err, stdout, stderr) => {
      assert.strictEqual(err.code, 7);
      assert.strictEqual(Object.getPrototypeOf(err).name, 'Error');
      assert.strictEqual(stdout, 'Monitored: Shall exit, will throw now\n');
      assert.strictEqual(
        errLine,
        'ReferenceError: missingFunction is not defined'
      );
    })
  );
}
const theErr = new Error('MyError');
process.on(
  'uncaughtExceptionMonitor',
  common.mustCall((err, origin) => {
    assert.strictEqual(err, theErr);
    assert.strictEqual(origin, 'uncaughtException');
  }, 2)
);
process.on('uncaughtException', common.mustCall((err, origin) => {
  assert.strictEqual(origin, 'uncaughtException');
  assert.strictEqual(err, theErr);
  process.nextTick(common.mustCall(() => {
    process.setUncaughtExceptionCaptureCallback(common.mustCall(
      (err) => assert.strictEqual(err, theErr))
    );
    throw theErr;
  }));
}));
throw theErr;
