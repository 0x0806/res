'use strict';
const assert = require('assert');
const { OutgoingMessage } = require('http');
{
  const expectedMsecs = 42;
  const outgoingMessage = new OutgoingMessage();
  outgoingMessage.socket = {
    setTimeout: common.mustCall((msecs) => {
      assert.strictEqual(msecs, expectedMsecs);
    })
  };
  outgoingMessage.setTimeout(expectedMsecs);
}
{
  const expectedMsecs = 23;
  const outgoingMessage = new OutgoingMessage();
  outgoingMessage.setTimeout(expectedMsecs);
  outgoingMessage.emit('socket', {
    setTimeout: common.mustCall((msecs) => {
      assert.strictEqual(msecs, expectedMsecs);
    })
  });
}
