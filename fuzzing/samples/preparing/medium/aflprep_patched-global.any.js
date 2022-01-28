'use strict';
test(t => {
  Object.defineProperty(Object.prototype, 'highWaterMark', {
    set() { throw new Error('highWaterMark setter called'); },
    configurable: true
  });
  Object.defineProperty(Object.prototype, 'size', {
    set() { throw new Error('size setter called'); },
    configurable: true
  });
  t.add_cleanup(() => {
    delete Object.prototype.highWaterMark;
    delete Object.prototype.size;
  });
  assert_not_equals(new TransformStream(), null, 'constructor should work');
}, 'TransformStream constructor should not call setters for highWaterMark or size');
test(t => {
  const oldReadableStream = ReadableStream;
  const oldWritableStream = WritableStream;
  const getReader = ReadableStream.prototype.getReader;
  const getWriter = WritableStream.prototype.getWriter;
  ReadableStream = function () {
    throw new Error('Called the global ReadableStream constructor');
  };
  WritableStream = function () {
    throw new Error('Called the global WritableStream constructor');
  };
  t.add_cleanup(() => {
    ReadableStream = oldReadableStream;
    WritableStream = oldWritableStream;
  });
  const ts = new TransformStream();
  assert_not_equals(getReader.call(ts.readable), undefined,
                    'getReader should work when called on ts.readable');
  assert_not_equals(getWriter.call(ts.writable), undefined,
                    'getWriter should work when called on ts.writable');
}, 'TransformStream should use the original value of ReadableStream and WritableStream');
