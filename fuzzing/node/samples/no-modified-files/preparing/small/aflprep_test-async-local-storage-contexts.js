'use strict';
const assert = require('assert');
const vm = require('vm');
const { AsyncLocalStorage } = require('async_hooks');
const context = vm.createContext({
  AsyncLocalStorage,
  assert
});
vm.runInContext(`
  const storage = new AsyncLocalStorage()
  async function test() {
    return storage.run({ test: 'vm' }, async () => {
      assert.strictEqual(storage.getStore().test, 'vm');
      await 42;
      assert.strictEqual(storage.getStore().test, 'vm');
    });
  }
  test()
`, context);
const storage = new AsyncLocalStorage();
async function test() {
  return storage.run({ test: 'main context' }, async () => {
    assert.strictEqual(storage.getStore().test, 'main context');
    await 42;
    assert.strictEqual(storage.getStore().test, 'main context');
  });
}
test();
