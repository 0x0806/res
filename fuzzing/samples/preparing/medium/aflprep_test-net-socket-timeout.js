'use strict';
const net = require('net');
const assert = require('assert');
const { inspect } = require('util');
const s = new net.Socket();
const nonNumericDelays = [
  '100', true, false, undefined, null, '', {}, () => {}, [],
];
const badRangeDelays = [-0.001, -1, -Infinity, Infinity, NaN];
const validDelays = [0, 0.001, 1, 1e6];
const invalidCallbacks = [
  1, '100', true, false, null, {}, [], Symbol('test'),
];
for (let i = 0; i < nonNumericDelays.length; i++) {
  assert.throws(() => {
    s.setTimeout(nonNumericDelays[i], () => {});
  }, { code: 'ERR_INVALID_ARG_TYPE' }, nonNumericDelays[i]);
}
for (let i = 0; i < badRangeDelays.length; i++) {
  assert.throws(() => {
    s.setTimeout(badRangeDelays[i], () => {});
  }, { code: 'ERR_OUT_OF_RANGE' }, badRangeDelays[i]);
}
for (let i = 0; i < validDelays.length; i++) {
  s.setTimeout(validDelays[i], () => {});
}
for (let i = 0; i < invalidCallbacks.length; i++) {
  [0, 1].forEach((mesc) =>
    assert.throws(
      () => s.setTimeout(mesc, invalidCallbacks[i]),
      {
        code: 'ERR_INVALID_CALLBACK',
        name: 'TypeError',
        message: 'Callback must be a function. ' +
                 `Received ${inspect(invalidCallbacks[i])}`
      }
    )
  );
}
const server = net.Server();
server.listen(0, common.mustCall(() => {
  const socket = net.createConnection(server.address().port);
  assert.strictEqual(
    socket.setTimeout(1, common.mustCall(() => {
      socket.destroy();
      assert.strictEqual(socket.setTimeout(1, common.mustNotCall()), socket);
      server.close();
    })),
    socket
  );
}));
