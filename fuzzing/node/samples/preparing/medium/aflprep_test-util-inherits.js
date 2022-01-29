'use strict';
const assert = require('assert');
const { inherits } = require('util');
function A() {
  this._a = 'a';
}
A.prototype.a = function() { return this._a; };
function B(value) {
  A.call(this);
  this._b = value;
}
inherits(B, A);
B.prototype.b = function() { return this._b; };
assert.deepStrictEqual(
  Object.getOwnPropertyDescriptor(B, 'super_'),
  {
    value: A,
    enumerable: false,
    configurable: true,
    writable: true
  }
);
const b = new B('b');
assert.strictEqual(b.a(), 'a');
assert.strictEqual(b.b(), 'b');
assert.strictEqual(b.constructor, B);
function C() {
  B.call(this, 'b');
  this._c = 'c';
}
inherits(C, B);
C.prototype.c = function() { return this._c; };
C.prototype.getValue = function() { return this.a() + this.b() + this.c(); };
assert.strictEqual(C.super_, B);
const c = new C();
assert.strictEqual(c.getValue(), 'abc');
assert.strictEqual(c.constructor, C);
function D() {
  C.call(this);
  this._d = 'd';
}
D.prototype.d = function() { return this._d; };
inherits(D, C);
assert.strictEqual(D.super_, C);
const d = new D();
assert.strictEqual(d.c(), 'c');
assert.strictEqual(d.d(), 'd');
assert.strictEqual(d.constructor, D);
class E {
  constructor() {
    D.call(this);
    this._e = 'e';
  }
  e() { return this._e; }
}
inherits(E, D);
assert.strictEqual(E.super_, D);
const e = new E();
assert.strictEqual(e.getValue(), 'abc');
assert.strictEqual(e.d(), 'd');
assert.strictEqual(e.e(), 'e');
assert.strictEqual(e.constructor, E);
assert.throws(() => {
  inherits(A, {});
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "superCtor.prototype" property must be of type object. ' +
           'Received undefined'
});
assert.throws(() => {
  inherits(A, null);
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "superCtor" argument must be of type function. ' +
           'Received null'
});
assert.throws(() => {
  inherits(null, A);
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
  message: 'The "ctor" argument must be of type function. Received null'
});
