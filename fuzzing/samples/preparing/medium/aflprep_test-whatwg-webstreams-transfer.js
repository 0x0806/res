'use strict';
const {
  ReadableStream,
  WritableStream,
  TransformStream,
const {
  Worker
} = require('worker_threads');
const {
  isReadableStream,
const {
  isWritableStream,
const {
  isTransformStream,
const {
  makeTransferable,
  kClone,
  kTransfer,
  kDeserialize,
const assert = require('assert');
const theData = 'hello';
{
  const { port1, port2 } = new MessageChannel();
  port1.onmessageerror = common.mustNotCall();
  port2.onmessageerror = common.mustNotCall();
  const readable = new ReadableStream({
    start: common.mustCall((controller) => {
      controller.enqueue(theData);
      controller.close();
    }),
  });
  port2.onmessage = common.mustCall(({ data }) => {
    assert(isReadableStream(data));
    const reader = data.getReader();
    reader.read().then(common.mustCall((chunk) => {
      assert.deepStrictEqual(chunk, { done: false, value: theData });
    }));
    port2.close();
  });
  port1.onmessage = common.mustCall(({ data }) => {
    assert(isReadableStream(data));
    assert(!data.locked);
    port1.postMessage(data, [data]);
    assert(data.locked);
  });
  assert.throws(() => port2.postMessage(readable), {
    code: 'ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST',
  });
  port2.postMessage(readable, [readable]);
  assert(readable.locked);
}
{
  const { port1, port2 } = new MessageChannel();
  port1.onmessageerror = common.mustNotCall();
  port2.onmessageerror = common.mustNotCall();
  const writable = new WritableStream({
    write: common.mustCall((chunk) => {
      assert.strictEqual(chunk, theData);
    }),
  });
  port2.onmessage = common.mustCall(({ data }) => {
    assert(isWritableStream(data));
    assert(!data.locked);
    const writer = data.getWriter();
    writer.write(theData).then(common.mustCall());
    writer.close();
    port2.close();
  });
  port1.onmessage = common.mustCall(({ data }) => {
    assert(isWritableStream(data));
    assert(!data.locked);
    port1.postMessage(data, [data]);
    assert(data.locked);
  });
  assert.throws(() => port2.postMessage(writable), {
    code: 'ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST',
  });
  port2.postMessage(writable, [writable]);
  assert(writable.locked);
}
{
  const { port1, port2 } = new MessageChannel();
  port1.onmessageerror = common.mustNotCall();
  port2.onmessageerror = common.mustNotCall();
  const transform = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    }
  });
  port2.onmessage = common.mustCall(({ data }) => {
    assert(isTransformStream(data));
    const writer = data.writable.getWriter();
    const reader = data.readable.getReader();
    Promise.all([
      writer.write(theData),
      writer.close(),
      reader.read().then(common.mustCall((result) => {
        assert(!result.done);
        assert.strictEqual(result.value, theData.toUpperCase());
      })),
      reader.read().then(common.mustCall((result) => {
        assert(result.done);
      })),
    ]).then(common.mustCall());
    port2.close();
  });
  port1.onmessage = common.mustCall(({ data }) => {
    assert(isTransformStream(data));
    assert(!data.readable.locked);
    assert(!data.writable.locked);
    port1.postMessage(data, [data]);
    assert(data.readable.locked);
    assert(data.writable.locked);
  });
  assert.throws(() => port2.postMessage(transform), {
    code: 'ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST',
  });
  port2.postMessage(transform, [transform]);
  assert(transform.readable.locked);
  assert(transform.writable.locked);
}
{
  const { port1, port2 } = new MessageChannel();
  let controller;
  const readable = new ReadableStream({
    start(c) { controller = c; },
    cancel: common.mustCall((error) => {
    }),
  });
  port1.onmessage = ({ data }) => {
    const reader = data.getReader();
    assert.rejects(reader.read(), {
    });
    port1.close();
  };
  port2.postMessage(readable, [readable]);
  const notActuallyTransferable = makeTransferable({
    [kClone]() {
      return {
        data: {},
        deserializeInfo: 'nothing that will work',
      };
    },
    [kDeserialize]: common.mustNotCall(),
  });
  controller.enqueue(notActuallyTransferable);
}
{
  const { port1, port2 } = new MessageChannel();
  const source = {
    abort: common.mustCall((error) => {
      process.nextTick(() => {
        assert.strictEqual(error.code, 25);
        assert.strictEqual(error.name, 'DataCloneError');
      });
    })
  };
  const writable = new WritableStream(source);
  const notActuallyTransferable = makeTransferable({
    [kClone]() {
      return {
        data: {},
        deserializeInfo: 'nothing that will work',
      };
    },
    [kDeserialize]: common.mustNotCall(),
  });
  port1.onmessage = common.mustCall(({ data }) => {
    const writer = data.getWriter();
    assert.rejects(writer.closed, {
      code: 25,
      name: 'DataCloneError',
    });
    writer.write(notActuallyTransferable).then(common.mustCall());
    port1.close();
  });
  port2.postMessage(writable, [writable]);
}
{
  const error = new Error('boom');
  const { port1, port2 } = new MessageChannel();
  const source = {
    abort: common.mustCall((reason) => {
      process.nextTick(() => {
        assert.deepStrictEqual(reason, error);
        assert.notStrictEqual(reason, error);
      });
    }),
  };
  const writable = new WritableStream(source);
  port1.onmessage = common.mustCall(({ data }) => {
    const writer = data.getWriter();
    assert.rejects(writer.closed, error);
    writer.abort(error).then(common.mustCall());
    port1.close();
  });
  port2.postMessage(writable, [writable]);
}
{
  const { port1, port2 } = new MessageChannel();
  const source = {
    abort: common.mustCall((error) => {
      process.nextTick(() => assert.strictEqual(error.code, 25));
    })
  };
  const writable = new WritableStream(source);
  port1.onmessage = common.mustCall(({ data }) => {
    const writer = data.getWriter();
    const m = new WebAssembly.Memory({ initial: 1 });
    assert.rejects(writer.abort(m), {
      code: 25
    });
    port1.close();
  });
  port2.postMessage(writable, [writable]);
}
{
  const worker = new Worker(`
    const {
      isReadableStream,
    const {
      parentPort,
    } = require('worker_threads');
    const assert = require('assert');
    const tracker = new assert.CallTracker();
    process.on('exit', () => {
      tracker.verify();
    });
    parentPort.onmessage = tracker.calls(({ data }) => {
      assert(isReadableStream(data));
      const reader = data.getReader();
      reader.read().then(tracker.calls((result) => {
        assert(!result.done);
        assert(result.value instanceof Uint8Array);
      }));
      parentPort.close();
    });
    parentPort.onmessageerror = () => assert.fail('should not be called');
  `, { eval: true });
  worker.on('error', common.mustNotCall());
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(10));
      controller.close();
    }
  });
  worker.postMessage(readable, [readable]);
}
{
  const source = {
    cancel: common.mustCall(),
  };
  const readable = new ReadableStream(source);
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = common.mustCall(({ data }) => {
    data.cancel().then(common.mustCall());
    port1.close();
  });
  port2.postMessage(readable, [readable]);
}
{
  const source = {
    cancel: common.mustCall((error) => {
      process.nextTick(() => assert(error.code, 25));
    }),
  };
  const readable = new ReadableStream(source);
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = common.mustCall(({ data }) => {
    const m = new WebAssembly.Memory({ initial: 1 });
    const reader = data.getReader();
    const cancel = reader.cancel(m);
    reader.closed.then(common.mustCall());
    assert.rejects(cancel, {
      code: 25
    });
    port1.close();
  });
  port2.postMessage(readable, [readable]);
}
{
  const source = {
    abort: common.mustCall((error) => {
      process.nextTick(() => {
        assert.strictEqual(error.code, 25);
      });
    }),
  };
  const writable = new WritableStream(source);
  const { port1, port2 } = new MessageChannel();
  port1.onmessage = common.mustCall(({ data }) => {
    const m = new WebAssembly.Memory({ initial: 1 });
    const writer = data.getWriter();
    const write = writer.write(m);
    assert.rejects(write, { code: 25 });
    port1.close();
  });
  port2.postMessage(writable, [writable]);
}
{
  const readable = new ReadableStream();
  readable.getReader();
  assert.throws(() => readable[kTransfer](), {
    code: 25
  });
  const writable = new WritableStream();
  writable.getWriter();
  assert.throws(() => writable[kTransfer](), {
    code: 25
  });
}
