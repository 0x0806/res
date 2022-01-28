'use strict';
const {
  hijackStderr,
  restoreStderr
const assert = require('assert');
function test1() {
  hijackStderr(common.mustNotCall('stderr.write must not be called'));
  process.emit('warning', 'test');
  setImmediate(test2);
}
function test2() {
  process.noDeprecation = true;
  process.emitWarning('test', 'DeprecationWarning');
  process.noDeprecation = false;
  setImmediate(test3);
}
function test3() {
  restoreStderr();
  process.emitWarning('test', {});
  process.once('warning', common.mustCall((warning) => {
    assert.strictEqual(warning.name, 'Warning');
  }));
  setImmediate(test4);
}
function test4() {
  process.throwDeprecation = true;
  process.once('uncaughtException', (err) => {
  });
  try {
    process.emitWarning('test', 'DeprecationWarning');
  } catch {
    assert.fail('Unreachable');
  }
  process.throwDeprecation = false;
  setImmediate(test5);
}
function test5() {
  const err = new Error('test');
  err.toString = 1;
  process.emitWarning(err);
  setImmediate(test6);
}
function test6() {
  process.emitWarning('test', { detail: 'foo' });
  process.on('warning', (warning) => {
    assert.strictEqual(warning.detail, 'foo');
  });
}
test1();
