'use strict';
const assert = require('assert');
const buffer = fixtures.readSync('simple.wasm');
assert.ok(WebAssembly.validate(buffer), 'Buffer should be valid WebAssembly');
WebAssembly.instantiate(buffer, {}).then((results) => {
  assert.strictEqual(
    results.instance.exports.add(10, 20),
    30
  );
});
