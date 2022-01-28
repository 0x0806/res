'use strict';
const assert = require('assert');
const OutgoingMessage = require('_http_outgoing').OutgoingMessage;
const outgoingMessage = new OutgoingMessage();
assert.throws(
  () => { outgoingMessage.pipe(outgoingMessage); },
  {
    code: 'ERR_STREAM_CANNOT_PIPE',
    name: 'Error'
  }
);
