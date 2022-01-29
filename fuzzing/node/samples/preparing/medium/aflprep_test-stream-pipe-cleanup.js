'use strict';
const stream = require('stream');
const assert = require('assert');
function Writable() {
  this.writable = true;
  this.endCalls = 0;
  stream.Stream.call(this);
}
Object.setPrototypeOf(Writable.prototype, stream.Stream.prototype);
Object.setPrototypeOf(Writable, stream.Stream);
Writable.prototype.end = function() {
  this.endCalls++;
};
Writable.prototype.destroy = function() {
  this.endCalls++;
};
function Readable() {
  this.readable = true;
  stream.Stream.call(this);
}
Object.setPrototypeOf(Readable.prototype, stream.Stream.prototype);
Object.setPrototypeOf(Readable, stream.Stream);
function Duplex() {
  this.readable = true;
  Writable.call(this);
}
Object.setPrototypeOf(Duplex.prototype, Writable.prototype);
Object.setPrototypeOf(Duplex, Writable);
let i = 0;
const limit = 100;
let w = new Writable();
let r;
for (i = 0; i < limit; i++) {
  r = new Readable();
  r.pipe(w);
  r.emit('end');
}
assert.strictEqual(r.listeners('end').length, 0);
assert.strictEqual(w.endCalls, limit);
w.endCalls = 0;
for (i = 0; i < limit; i++) {
  r = new Readable();
  r.pipe(w);
  r.emit('close');
}
assert.strictEqual(r.listeners('close').length, 0);
assert.strictEqual(w.endCalls, limit);
w.endCalls = 0;
r = new Readable();
for (i = 0; i < limit; i++) {
  w = new Writable();
  r.pipe(w);
  w.emit('close');
}
assert.strictEqual(w.listeners('close').length, 0);
r = new Readable();
w = new Writable();
const d = new Duplex();
assert.strictEqual(d.listeners('close').length, 3);
assert.strictEqual(w.listeners('end').length, 0);
r.emit('end');
assert.strictEqual(d.endCalls, 1);
assert.strictEqual(w.endCalls, 0);
assert.strictEqual(r.listeners('end').length, 0);
assert.strictEqual(r.listeners('close').length, 0);
assert.strictEqual(w.listeners('end').length, 0);
d.emit('end');
assert.strictEqual(d.endCalls, 1);
assert.strictEqual(w.endCalls, 1);
assert.strictEqual(r.listeners('end').length, 0);
assert.strictEqual(r.listeners('close').length, 0);
assert.strictEqual(d.listeners('end').length, 0);
assert.strictEqual(d.listeners('close').length, 0);
assert.strictEqual(w.listeners('end').length, 0);
assert.strictEqual(w.listeners('close').length, 0);
