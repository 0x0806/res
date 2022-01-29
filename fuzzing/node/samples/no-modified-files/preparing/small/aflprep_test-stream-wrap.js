'use strict';
const assert = require('assert');
const { Duplex } = require('stream');
const { ShutdownWrap } = internalBinding('stream_wrap');
function testShutdown(callback) {
  const stream = new Duplex({
    read: function() {
    },
    write: function() {
    }
  });
  const wrap = new StreamWrap(stream);
  const req = new ShutdownWrap();
  req.oncomplete = function(code) {
    assert(code < 0);
    callback();
  };
  req.handle = wrap._handle;
  wrap.destroy();
  req.handle.shutdown(req);
}
testShutdown(common.mustCall());
