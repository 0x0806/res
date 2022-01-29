'use strict';
Error.stackTraceLimit = 0;
console.error('before');
let array = [];
for (let i = 0; i < 100000; i++) {
  array = [ array ];
}
JSON.stringify(array);
console.error('after');
