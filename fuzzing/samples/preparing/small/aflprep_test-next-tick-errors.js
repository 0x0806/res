'use strict';
const assert = require('assert');
const order = [];
let exceptionHandled = false;
process.nextTick(function() {
  order.push('A');
});
process.nextTick(function() {
  order.push('C');
});
function testNextTickWith(val) {
  assert.throws(() => {
    process.nextTick(val);
  }, {
    code: 'ERR_INVALID_CALLBACK',
    name: 'TypeError'
  });
}
testNextTickWith(false);
testNextTickWith(true);
testNextTickWith(1);
testNextTickWith('str');
testNextTickWith({});
testNextTickWith([]);
process.on('uncaughtException', function(err, errorOrigin) {
  assert.strictEqual(errorOrigin, 'uncaughtException');
  if (!exceptionHandled) {
    exceptionHandled = true;
    order.push('B');
  } else {
    order.push('OOPS!');
  }
});
process.on('exit', function() {
  assert.deepStrictEqual(order, ['A', 'B', 'C']);
});
