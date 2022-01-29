'use strict';
const assert = require('assert');
const { Duplex } = require('stream');
const { ShutdownWrap } = internalBinding('stream_wrap');
{
  let resolve = null;
  class TestDuplex extends Duplex {
    _write(chunk, encoding, callback) {
      resolve = () => {
        callback();
      };
    }
    _read() {}
  }
  const testDuplex = new TestDuplex();
  const socket = new StreamWrap(testDuplex);
  socket.write(
    Buffer.allocUnsafe(socket.writableHighWaterMark * 2),
    common.mustCall()
  );
  testDuplex.on('drain', common.mustCall(() => {
    console.log('testDuplex drain');
  }));
  assert.strictEqual(typeof resolve, 'function');
  const req = new ShutdownWrap();
  req.oncomplete = common.mustCall();
  req.handle = socket._handle;
  socket._handle.shutdown(req);
  resolve();
}
