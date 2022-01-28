'use strict';
const runner = new WPTRunner('streams');
runner.setFlags(['--expose-internals']);
runner.setInitScript(`
  let {
    ReadableStream,
    ReadableStreamDefaultReader,
    ReadableStreamBYOBReader,
    ReadableStreamBYOBRequest,
    ReadableByteStreamController,
    ReadableStreamDefaultController,
    TransformStream,
    TransformStreamDefaultController,
    WritableStream,
    WritableStreamDefaultWriter,
    WritableStreamDefaultController,
    ByteLengthQueuingStrategy,
    CountQueuingStrategy,
  const { DOMException } = internalBinding('messaging');
  global.DOMException = DOMException;
  Object.defineProperties(global, {
    ReadableStream: {
      value: ReadableStream,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ReadableStreamDefaultReader: {
      value: ReadableStreamDefaultReader,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ReadableStreamBYOBReader: {
      value: ReadableStreamBYOBReader,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ReadableStreamBYOBRequest: {
      value: ReadableStreamBYOBRequest,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ReadableByteStreamController: {
      value: ReadableByteStreamController,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ReadableStreamDefaultController: {
      value: ReadableStreamDefaultController,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    TransformStream: {
      value: TransformStream,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    TransformStreamDefaultController: {
      value: TransformStreamDefaultController,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    WritableStream: {
      value: WritableStream,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    WritableStreamDefaultWriter: {
      value: WritableStreamDefaultWriter,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    WritableStreamDefaultController: {
      value: WritableStreamDefaultController,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    ByteLengthQueuingStrategy: {
      value: ByteLengthQueuingStrategy,
      configurable: true,
      writable: true,
      enumerable: false,
    },
    CountQueuingStrategy: {
      value: CountQueuingStrategy,
      configurable: true,
      writable: true,
      enumerable: false,
    },
  });
  function postMessage(value, origin, transferList) {
    const mc = new MessageChannel();
    mc.port1.postMessage(value, transferList);
    mc.port2.close();
  }
  Object.defineProperties(global, {
    DedicatedWorkerGlobalScope: {
      get() {
        if (new Error().stack.includes('idlharness.js'))
          return global.constructor;
        else
          return function() {};
      }
    }
  });
`);
runner.runJsTests();
