'use strict';
const assert = require('assert');
const {
  PromisePrototypeCatch,
  PromisePrototypeThen,
  SafePromisePrototypeFinally,
Promise.prototype.catch = common.mustNotCall();
Promise.prototype.finally = common.mustNotCall();
Promise.prototype.then = common.mustNotCall();
assertIsPromise(PromisePrototypeCatch(Promise.reject(), common.mustCall()));
assertIsPromise(PromisePrototypeThen(test(), common.mustCall()));
assertIsPromise(SafePromisePrototypeFinally(test(), common.mustCall()));
async function test() {
  const catchFn = common.mustCall();
  const finallyFn = common.mustCall();
  try {
    await Promise.reject();
  } catch {
    catchFn();
  } finally {
    finallyFn();
  }
}
function assertIsPromise(promise) {
  assert.strictEqual(Object.getPrototypeOf(promise), Promise.prototype);
}
