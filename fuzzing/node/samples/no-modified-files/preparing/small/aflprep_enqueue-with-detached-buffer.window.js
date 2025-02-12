promise_test(async t => {
  const error = new Error('cannot proceed');
  const rs = new ReadableStream({
    type: 'bytes',
    pull: t.step_func((controller) => {
      const buffer = controller.byobRequest.view.buffer;
      postMessage(buffer, '*', [buffer]);
      assert_throws_js(TypeError, () => controller.enqueue(new Uint8Array([42])));
      controller.error(error);
    })
  });
  const reader = rs.getReader({ mode: 'byob' });
  await promise_rejects_exactly(t, error, reader.read(new Uint8Array(1)));
}, 'enqueue after detaching byobRequest.view.buffer should throw');
