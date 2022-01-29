'use strict';
const assert = require('assert');
assert.strictEqual(process.report.directory, '');
process.report.directory = __dirname;
assert.strictEqual(process.report.directory, __dirname);
assert.throws(() => {
  process.report.directory = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.directory, __dirname);
assert.strictEqual(process.report.filename, '');
process.report.filename = 'test-report.json';
assert.strictEqual(process.report.filename, 'test-report.json');
assert.throws(() => {
  process.report.filename = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.filename, 'test-report.json');
assert.strictEqual(process.report.reportOnFatalError, true);
process.report.reportOnFatalError = false;
assert.strictEqual(process.report.reportOnFatalError, false);
process.report.reportOnFatalError = true;
assert.strictEqual(process.report.reportOnFatalError, true);
assert.throws(() => {
  process.report.reportOnFatalError = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.reportOnFatalError, true);
assert.strictEqual(process.report.reportOnUncaughtException, true);
process.report.reportOnUncaughtException = false;
assert.strictEqual(process.report.reportOnUncaughtException, false);
process.report.reportOnUncaughtException = true;
assert.strictEqual(process.report.reportOnUncaughtException, true);
assert.throws(() => {
  process.report.reportOnUncaughtException = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.reportOnUncaughtException, true);
assert.strictEqual(process.report.reportOnSignal, true);
process.report.reportOnSignal = false;
assert.strictEqual(process.report.reportOnSignal, false);
process.report.reportOnSignal = true;
assert.strictEqual(process.report.reportOnSignal, true);
assert.throws(() => {
  process.report.reportOnSignal = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.reportOnSignal, true);
assert.strictEqual(process.report.compact, true);
process.report.compact = false;
assert.strictEqual(process.report.compact, false);
process.report.compact = true;
assert.strictEqual(process.report.compact, true);
assert.throws(() => {
  process.report.compact = {};
}, { code: 'ERR_INVALID_ARG_TYPE' });
assert.strictEqual(process.report.compact, true);
if (!common.isWindows) {
  assert.strictEqual(process.report.signal, 'SIGUSR2');
  assert.throws(() => {
    process.report.signal = {};
  }, { code: 'ERR_INVALID_ARG_TYPE' });
  assert.throws(() => {
    process.report.signal = 'foo';
  }, {
    code: 'ERR_UNKNOWN_SIGNAL',
    message: 'Unknown signal: foo'
  });
  assert.throws(() => {
    process.report.signal = 'sigusr1';
  }, {
    code: 'ERR_UNKNOWN_SIGNAL',
    message: 'Unknown signal: sigusr1 (signals must use all capital letters)'
  });
  assert.strictEqual(process.report.signal, 'SIGUSR2');
  process.report.signal = 'SIGUSR1';
  assert.strictEqual(process.report.signal, 'SIGUSR1');
  process.report.signal = 'SIGUSR2';
  process.report.reportOnSignal = false;
  assert.strictEqual(process.listenerCount('SIGUSR2'), 0);
  process.report.reportOnSignal = true;
  assert.strictEqual(process.listenerCount('SIGUSR2'), 1);
  process.report.signal = 'SIGUSR1';
  assert.strictEqual(process.listenerCount('SIGUSR2'), 0);
  assert.strictEqual(process.listenerCount('SIGUSR1'), 1);
  process.report.reportOnSignal = false;
  assert.strictEqual(process.listenerCount('SIGUSR1'), 0);
}
