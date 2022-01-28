'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
Object.setPrototypeOf(MyEE.prototype, EventEmitter.prototype);
Object.setPrototypeOf(MyEE, EventEmitter);
function MyEE(cb) {
  this.once(1, cb);
  this.emit(1);
  this.removeAllListeners();
  EventEmitter.call(this);
}
const myee = new MyEE(common.mustCall());
myee.hasOwnProperty('usingDomains');
Object.setPrototypeOf(ErrorEE.prototype, EventEmitter.prototype);
Object.setPrototypeOf(ErrorEE, EventEmitter);
function ErrorEE() {
  this.emit('error', new Error('blerg'));
}
assert.throws(function() {
  new ErrorEE();
process.on('exit', function() {
  assert(!(myee._events instanceof Object));
  assert.deepStrictEqual(Object.keys(myee._events), []);
  console.log('ok');
});
function MyEE2() {
  EventEmitter.call(this);
}
MyEE2.prototype = new EventEmitter();
const ee1 = new MyEE2();
const ee2 = new MyEE2();
ee1.on('x', () => {});
assert.strictEqual(ee2.listenerCount('x'), 0);
