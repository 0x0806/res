'use strict';
const assert = require('assert');
const vm = require('vm');
function a() {
  try {
    return a();
  } catch {
    return vm.runInThisContext('() => 42')();
  }
}
assert.strictEqual(a(), 42);
function b() {
  try {
    return b();
  } catch {
    return vm.runInNewContext('() => 42')();
  }
}
assert.strictEqual(b(), 42);
