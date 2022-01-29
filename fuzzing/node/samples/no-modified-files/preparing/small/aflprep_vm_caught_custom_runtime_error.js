'use strict';
const vm = require('vm');
console.error('beginning');
try {
  vm.runInThisContext(`throw ({
    name: 'MyCustomError',
    message: 'This is a custom message'
  })`, { filename: 'test.vm' });
} catch (e) {
  console.error('received error', e.name);
}
console.error('end');
