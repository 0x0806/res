'use strict';
const vm = require('vm');
console.error('before');
vm.runInNewContext('foo.bar = 5;');
console.error('after');
