'use strict';
const assert = require('assert');
const {
  MessageEvent,
[
  'data',
  'origin',
  'lastEventId',
  'source',
  'ports',
].forEach((i) => {
  assert.throws(() => Reflect.get(MessageEvent.prototype, i, {}), {
    code: 'ERR_INVALID_THIS',
  });
});
