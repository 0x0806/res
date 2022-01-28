'use strict';
const assert = require('assert');
let error;
(async () => {
  try {
    await import(file);
  } catch (e) {
    assert.strictEqual(e.name, 'SyntaxError');
    error = e;
  }
  assert(error);
  await assert.rejects(
    () => import(file),
    (e) => {
      assert.strictEqual(error, e);
      return true;
    }
  );
})().then(common.mustCall());
