'use strict';
const assert = require('assert');
const TTY = internalBinding('tty_wrap').TTY;
{
  assert.strictEqual(TTY.prototype.propertyIsEnumerable('bytesRead'), false);
  assert.strictEqual(TTY.prototype.propertyIsEnumerable('fd'), false);
  assert.strictEqual(
    TTY.prototype.propertyIsEnumerable('_externalStream'), false);
}
