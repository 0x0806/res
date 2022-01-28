'use strict';
const vm = require('vm');
process.stdout.getColorDepth = () => 8;
process.stderr.getColorDepth = () => 8;
console.log({ foo: 'bar' });
console.log('%s q', 'string');
console.log('%o with object format param', { foo: 'bar' });
console.log(
);
try {
} catch (err) {
  console.log(err);
}
vm.runInThisContext('console.log(new Error())');
