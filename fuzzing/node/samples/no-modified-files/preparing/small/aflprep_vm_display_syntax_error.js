'use strict';
const vm = require('vm');
console.error('beginning');
try {
  vm.runInThisContext('var 4;', { filename: 'foo.vm', displayErrors: true });
} catch (err) {
  console.error(err);
}
vm.runInThisContext('var 5;', { filename: 'test.vm' });
console.error('end');
