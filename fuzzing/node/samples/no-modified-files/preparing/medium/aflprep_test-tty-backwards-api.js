'use strict';
const assert = require('assert');
const readline = require('readline');
const noop = () => {};
const TTY = internalBinding('tty_wrap').TTY = function() {};
TTY.prototype = {
  setBlocking: noop,
  getWindowSize: noop
};
const { WriteStream } = require('tty');
[
  'cursorTo',
  'moveCursor',
  'clearLine',
  'clearScreenDown',
].forEach((method) => {
  readline[method] = common.mustCall(function() {
    const lastArg = arguments[arguments.length - 1];
    if (typeof lastArg === 'function') {
      process.nextTick(lastArg);
    }
    return true;
  }, 2);
});
const writeStream = new WriteStream(1);
assert.strictEqual(writeStream.cursorTo(1, 2), true);
assert.strictEqual(writeStream.cursorTo(1, 2, common.mustCall()), true);
assert.strictEqual(writeStream.moveCursor(1, 2), true);
assert.strictEqual(writeStream.moveCursor(1, 2, common.mustCall()), true);
assert.strictEqual(writeStream.clearLine(1), true);
assert.strictEqual(writeStream.clearLine(1, common.mustCall()), true);
assert.strictEqual(writeStream.clearScreenDown(), true);
assert.strictEqual(writeStream.clearScreenDown(common.mustCall()), true);
