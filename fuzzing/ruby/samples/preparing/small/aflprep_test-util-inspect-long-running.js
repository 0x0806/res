'use strict';
const util = require('util');
let last = {};
const obj = last;
for (let i = 0; i < 1000; i++) {
  last.next = { circular: obj, last, obj: { a: 1, b: 2, c: true } };
  last = last.next;
  obj[i] = last;
}
util.inspect(obj, { depth: Infinity });
