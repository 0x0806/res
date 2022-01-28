'use strict';
const assert = require('assert');
const stdoutWrite = process.stdout.write;
let buf = '';
process.stdout.write = (string) => buf = string;
console.count();
assert.strictEqual(buf, 'default: 1\n');
console.count('default');
assert.strictEqual(buf, 'default: 2\n');
console.count('a');
assert.strictEqual(buf, 'a: 1\n');
console.count('b');
assert.strictEqual(buf, 'b: 1\n');
console.count('a');
assert.strictEqual(buf, 'a: 2\n');
console.count();
assert.strictEqual(buf, 'default: 3\n');
console.count({});
assert.strictEqual(buf, '[object Object]: 1\n');
console.count(1);
assert.strictEqual(buf, '1: 1\n');
console.count(null);
assert.strictEqual(buf, 'null: 1\n');
console.count('null');
assert.strictEqual(buf, 'null: 2\n');
console.countReset();
console.count();
assert.strictEqual(buf, 'default: 1\n');
console.countReset('a');
console.count('a');
assert.strictEqual(buf, 'a: 1\n');
console.count();
assert.strictEqual(buf, 'default: 2\n');
process.stdout.write = stdoutWrite;
assert.throws(
  () => console.count(Symbol('test')),
  TypeError);
assert.throws(
  () => console.countReset(Symbol('test')),
  TypeError);
