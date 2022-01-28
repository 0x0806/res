'use strict';
const error1 = new Error('error1!');
error1.name = 'error1';
promise_test(() => {
  const rs = recordingReadableStream();
  const ws = recordingWritableStream();
  const writer = ws.getWriter();
  writer.close();
  writer.releaseLock();
  return rs.pipeTo(ws).then(
    () => assert_unreached('the promise must not fulfill'),
    err => {
      assert_equals(err.name, 'TypeError', 'the promise must reject with a TypeError');
      assert_array_equals(rs.eventsWithoutPulls, ['cancel', err]);
      assert_array_equals(ws.events, ['close']);
      return Promise.all([
        rs.getReader().closed,
        ws.getWriter().closed
      ]);
    }
  );
}, 'Closing must be propagated backward: starts closed; preventCancel omitted; fulfilled cancel promise');
promise_test(t => {
  let recordedError;
  const rs = recordingReadableStream({
    cancel(cancelErr) {
      recordedError = cancelErr;
      throw error1;
    }
  });
  const ws = recordingWritableStream();
  const writer = ws.getWriter();
  writer.close();
  writer.releaseLock();
  return promise_rejects_exactly(t, error1, rs.pipeTo(ws), 'pipeTo must reject with the same error').then(() => {
    assert_equals(recordedError.name, 'TypeError', 'the cancel reason must be a TypeError');
    assert_array_equals(rs.eventsWithoutPulls, ['cancel', recordedError]);
    assert_array_equals(ws.events, ['close']);
    return Promise.all([
      rs.getReader().closed,
      ws.getWriter().closed
    ]);
  });
}, 'Closing must be propagated backward: starts closed; preventCancel omitted; rejected cancel promise');
for (const falsy of [undefined, null, false, +0, -0, NaN, '']) {
  const stringVersion = Object.is(falsy, -0) ? '-0' : String(falsy);
  promise_test(() => {
    const rs = recordingReadableStream();
    const ws = recordingWritableStream();
    const writer = ws.getWriter();
    writer.close();
    writer.releaseLock();
    return rs.pipeTo(ws, { preventCancel: falsy }).then(
      () => assert_unreached('the promise must not fulfill'),
      err => {
        assert_equals(err.name, 'TypeError', 'the promise must reject with a TypeError');
        assert_array_equals(rs.eventsWithoutPulls, ['cancel', err]);
        assert_array_equals(ws.events, ['close']);
        return Promise.all([
          rs.getReader().closed,
          ws.getWriter().closed
        ]);
      }
    );
  }, `Closing must be propagated backward: starts closed; preventCancel = ${stringVersion} (falsy); fulfilled cancel ` +
     `promise`);
}
for (const truthy of [true, 'a', 1, Symbol(), { }]) {
  promise_test(t => {
    const rs = recordingReadableStream();
    const ws = recordingWritableStream();
    const writer = ws.getWriter();
    writer.close();
    writer.releaseLock();
    return promise_rejects_js(t, TypeError, rs.pipeTo(ws, { preventCancel: truthy })).then(() => {
      assert_array_equals(rs.eventsWithoutPulls, []);
      assert_array_equals(ws.events, ['close']);
      return ws.getWriter().closed;
    });
  }, `Closing must be propagated backward: starts closed; preventCancel = ${String(truthy)} (truthy)`);
}
promise_test(t => {
  const rs = recordingReadableStream();
  const ws = recordingWritableStream();
  const writer = ws.getWriter();
  writer.close();
  writer.releaseLock();
  return promise_rejects_js(t, TypeError, rs.pipeTo(ws, { preventCancel: true, preventAbort: true }))
    .then(() => {
      assert_array_equals(rs.eventsWithoutPulls, []);
      assert_array_equals(ws.events, ['close']);
      return ws.getWriter().closed;
    });
}, 'Closing must be propagated backward: starts closed; preventCancel = true, preventAbort = true');
promise_test(t => {
  const rs = recordingReadableStream();
  const ws = recordingWritableStream();
  const writer = ws.getWriter();
  writer.close();
  writer.releaseLock();
  return promise_rejects_js(t, TypeError,
                         rs.pipeTo(ws, { preventCancel: true, preventAbort: true, preventClose: true }))
  .then(() => {
    assert_array_equals(rs.eventsWithoutPulls, []);
    assert_array_equals(ws.events, ['close']);
    return ws.getWriter().closed;
  });
}, 'Closing must be propagated backward: starts closed; preventCancel = true, preventAbort = true, preventClose ' +
   '= true');
