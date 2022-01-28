'use strict';
const { OutgoingMessage } = require('http');
const warn = 'OutgoingMessage.prototype._headerNames is deprecated';
common.expectWarning('DeprecationWarning', warn, 'DEP0066');
{
  const outgoingMessage = new OutgoingMessage();
}
