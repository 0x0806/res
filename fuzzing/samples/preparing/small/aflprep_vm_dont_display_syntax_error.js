'use strict';
const vm = require('vm');
console.error('beginning');
try {
  vm.runInThisContext('var 5;', {
    filename: 'test.vm',
    displayErrors: false
  });
} catch {}
console.error('middle');
vm.runInThisContext('var 5;', {
  filename: 'test.vm',
  displayErrors: false
});
console.error('end');
