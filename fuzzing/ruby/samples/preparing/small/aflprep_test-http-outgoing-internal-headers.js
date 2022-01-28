'use strict';
const assert = require('assert');
const { OutgoingMessage } = require('http');
const warn = 'OutgoingMessage.prototype._headers is deprecated';
common.expectWarning('DeprecationWarning', warn, 'DEP0066');
{
  const outgoingMessage = new OutgoingMessage();
  outgoingMessage.getHeaders = common.mustCall();
}
{
  const outgoingMessage = new OutgoingMessage();
  outgoingMessage._headers = {
    host: 'risingstack.com',
    Origin: 'localhost'
  };
  assert.deepStrictEqual(
    Object.entries(outgoingMessage[kOutHeaders]),
    Object.entries({
      host: ['host', 'risingstack.com'],
      origin: ['Origin', 'localhost']
    }));
}
{
  const outgoingMessage = new OutgoingMessage();
  outgoingMessage._headers = null;
  assert.strictEqual(
    outgoingMessage[kOutHeaders],
    null
  );
}
