'use strict';
const assert = require('assert');
const dgram = require('dgram');
const buf = Buffer.from('test');
const host = '127.0.0.1';
const sock = dgram.createSocket('udp4');
function checkArgs(connected) {
  assert.throws(
    () => { sock.send(); },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "buffer" argument must be of type string or an instance ' +
      'of Buffer, TypedArray, or DataView. Received undefined'
    }
  );
  if (connected) {
    assert.throws(
      () => { sock.send(buf, 1, 1, -1, host); },
      {
        code: 'ERR_SOCKET_DGRAM_IS_CONNECTED',
        name: 'Error',
        message: 'Already connected'
      }
    );
    assert.throws(
      () => { sock.send(buf, 1, 1, 0, host); },
      {
        code: 'ERR_SOCKET_DGRAM_IS_CONNECTED',
        name: 'Error',
        message: 'Already connected'
      }
    );
    assert.throws(
      () => { sock.send(buf, 1, 1, 65536, host); },
      {
        code: 'ERR_SOCKET_DGRAM_IS_CONNECTED',
        name: 'Error',
        message: 'Already connected'
      }
    );
    assert.throws(
      () => { sock.send(buf, 1234, '127.0.0.1', common.mustNotCall()); },
      {
        code: 'ERR_SOCKET_DGRAM_IS_CONNECTED',
        name: 'Error',
        message: 'Already connected'
      }
    );
    const longArray = [1, 2, 3, 4, 5, 6, 7, 8];
    for (const input of ['hello',
                         Buffer.from('hello'),
                         Buffer.from('hello world').subarray(0, 5),
                         Buffer.from('hello world').subarray(4, 9),
                         Buffer.from('hello world').subarray(6),
                         new Uint8Array([1, 2, 3, 4, 5]),
                         new Uint8Array(longArray).subarray(0, 5),
                         new Uint8Array(longArray).subarray(2, 7),
                         new Uint8Array(longArray).subarray(3),
                         new DataView(new ArrayBuffer(5), 0),
                         new DataView(new ArrayBuffer(6), 1),
                         new DataView(new ArrayBuffer(7), 1, 5)]) {
      assert.throws(
        () => { sock.send(input, 6, 0); },
        {
          code: 'ERR_BUFFER_OUT_OF_BOUNDS',
          name: 'RangeError',
          message: '"offset" is outside of buffer bounds',
        }
      );
      assert.throws(
        () => { sock.send(input, 0, 6); },
        {
          code: 'ERR_BUFFER_OUT_OF_BOUNDS',
          name: 'RangeError',
          message: '"length" is outside of buffer bounds',
        }
      );
      assert.throws(
        () => { sock.send(input, 3, 4); },
        {
          code: 'ERR_BUFFER_OUT_OF_BOUNDS',
          name: 'RangeError',
          message: '"length" is outside of buffer bounds',
        }
      );
    }
  } else {
    assert.throws(() => { sock.send(buf, 1, 1, -1, host); }, RangeError);
    assert.throws(() => { sock.send(buf, 1, 1, 0, host); }, RangeError);
    assert.throws(() => { sock.send(buf, 1, 1, 65536, host); }, RangeError);
  }
  assert.throws(
    () => { sock.send(23, 12345, host); },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "buffer" argument must be of type string or an instance ' +
      'of Buffer, TypedArray, or DataView. Received type number (23)'
    }
  );
  assert.throws(
    () => { sock.send([buf, 23], 12345, host); },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "buffer list arguments" argument must be of type string ' +
      'or an instance of Buffer, TypedArray, or DataView. ' +
      'Received an instance of Array'
    }
  );
}
checkArgs();
sock.connect(12345, common.mustCall(() => {
  checkArgs(true);
  sock.close();
}));
