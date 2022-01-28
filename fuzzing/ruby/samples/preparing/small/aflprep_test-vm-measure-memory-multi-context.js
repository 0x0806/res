'use strict';
const {
  assertDetailedShape,
  expectExperimentalWarning
const vm = require('vm');
const assert = require('assert');
expectExperimentalWarning();
{
  const arr = [];
  const count = 10;
  for (let i = 0; i < count; ++i) {
    const context = vm.createContext({
      test: new Array(100).fill('foo')
    });
    arr.push(context);
  }
  vm.measureMemory({ mode: 'detailed', execution: 'eager' })
    .then(common.mustCall((result) => {
      assert.strictEqual(arr.length, count);
      assertDetailedShape(result, count);
    }));
}
