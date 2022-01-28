'use strict';
const fs = require('fs');
const assert = require('assert');
let counter = 0;
const _statSync = fs.statSync;
const _stat = fs.stat;
fs.statSync = function() {
  counter++;
  return _statSync.apply(this, arguments);
};
fs.stat = function() {
  counter++;
  return _stat.apply(this, arguments);
};
require('http');
console.log(`counterBefore = ${counter}`);
const counterBefore = counter;
for (let i = 0; i < 100; i++) {
}
for (let i = 0; i < 100; i++) {
  require('http');
}
console.log(`counterAfter = ${counter}`);
const counterAfter = counter;
assert.strictEqual(counterBefore, counterAfter);
