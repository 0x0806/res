'use strict';
const assert = require('assert');
const uv = internalBinding('uv');
const keys = Object.keys(uv);
keys.forEach((key) => {
  if (key.startsWith('UV_')) {
    const val = uv[key];
    assert.throws(() => uv[key] = 1, TypeError);
    assert.strictEqual(uv[key], val);
  }
});
