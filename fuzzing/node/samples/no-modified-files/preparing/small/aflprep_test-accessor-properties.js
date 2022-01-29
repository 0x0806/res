'use strict';
const assert = require('assert');
const TTY = internalBinding('tty_wrap').TTY;
const UDP = internalBinding('udp_wrap').UDP;
{
  assert.throws(() => {
  }, TypeError);
  const StreamWrapProto = Object.getPrototypeOf(TTY.prototype);
  const properties = ['bytesRead', 'fd', '_externalStream'];
  properties.forEach((property) => {
    assert.throws(() => {
    }, TypeError, `Missing expected TypeError for TTY.prototype.${property}`);
    assert.strictEqual(
      typeof Object.getOwnPropertyDescriptor(StreamWrapProto, property),
      'object',
      'typeof property descriptor ' + property + ' is not \'object\''
    );
  });
    const crypto = internalBinding('crypto');
    assert.throws(() => {
      crypto.SecureContext.prototype._external;
    }, TypeError);
    assert.strictEqual(
      typeof Object.getOwnPropertyDescriptor(
        crypto.SecureContext.prototype, '_external'),
      'object'
    );
  }
}
