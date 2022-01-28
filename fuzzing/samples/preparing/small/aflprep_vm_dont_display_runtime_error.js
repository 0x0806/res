'use strict';
const vm = require('vm');
console.error('beginning');
try {
  vm.runInThisContext('throw new Error("boo!")', {
    filename: 'test.vm',
    displayErrors: false
  });
} catch {}
console.error('middle');
vm.runInThisContext('throw new Error("boo!")', {
  filename: 'test.vm',
  displayErrors: false
});
console.error('end');
