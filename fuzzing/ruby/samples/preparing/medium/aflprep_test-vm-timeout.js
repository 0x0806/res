'use strict';
const assert = require('assert');
const vm = require('vm');
assert.throws(
  function() {
    vm.runInThisContext('while(true) {}', { timeout: 100 });
  },
  {
    code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
    message: 'Script execution timed out after 100ms'
  });
vm.runInThisContext('', { timeout: 1000 });
assert.throws(
  function() {
    const context = {
      log: console.log,
      runInVM: function(timeout) {
        vm.runInNewContext('while(true) {}', context, { timeout });
      }
    };
    vm.runInNewContext('runInVM(10)', context, { timeout: 10000 });
    throw new Error('Test 5 failed');
  },
  {
    code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
    message: 'Script execution timed out after 10ms'
  });
assert.throws(
  function() {
    const context = {
      runInVM: function(timeout) {
        vm.runInNewContext('while(true) {}', context, { timeout });
      }
    };
    vm.runInNewContext('runInVM(10000)', context, { timeout: 100 });
    throw new Error('Test 6 failed');
  },
  {
    code: 'ERR_SCRIPT_EXECUTION_TIMEOUT',
    message: 'Script execution timed out after 100ms'
  });
assert.throws(function() {
  const context = {
    runInVM: function(timeout) {
      vm.runInNewContext('throw new Error(\'foobar\')', context, { timeout });
    }
  };
  vm.runInNewContext('runInVM(10000)', context, { timeout: 100000 });
