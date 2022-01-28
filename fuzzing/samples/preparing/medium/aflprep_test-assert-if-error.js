'use strict';
const assert = require('assert');
let err;
(function a() {
  (function b() {
    (function c() {
      err = new Error('test error');
    })();
  })();
})();
const msg = err.message;
const stack = err.stack;
(function x() {
  (function y() {
    (function z() {
      let threw = false;
      try {
        assert.ifError(err);
      } catch (e) {
        assert.strictEqual(e.message,
                           'ifError got unwanted exception: test error');
        assert.strictEqual(err.message, msg);
        assert.strictEqual(e.actual, err);
        assert.strictEqual(e.actual.stack, stack);
        assert.strictEqual(e.expected, null);
        assert.strictEqual(e.operator, 'ifError');
        threw = true;
      }
      assert(threw);
    })();
  })();
})();
assert.throws(
  () => assert.ifError(new TypeError()),
  {
    message: 'ifError got unwanted exception: TypeError'
  }
);
assert.throws(
  () => assert.ifError({ stack: false }),
  {
    message: 'ifError got unwanted exception: { stack: false }'
  }
);
assert.throws(
  () => assert.ifError({ constructor: null, message: '' }),
  {
    message: 'ifError got unwanted exception: '
  }
);
assert.throws(
  () => { assert.ifError(false); },
  {
    message: 'ifError got unwanted exception: false'
  }
);
assert.ifError(null);
assert.ifError();
assert.ifError(undefined);
{
  let threw = false;
  try {
    assert.throws(() => {
      assert.ifError(null);
    });
  } catch (e) {
    threw = true;
    assert.strictEqual(e.message, 'Missing expected exception.');
    assert(!e.stack.includes('throws'), e);
  }
  assert(threw);
}
