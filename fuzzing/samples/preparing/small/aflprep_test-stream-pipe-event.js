'use strict';
const stream = require('stream');
const assert = require('assert');
function Writable() {
  this.writable = true;
  stream.Stream.call(this);
}
Object.setPrototypeOf(Writable.prototype, stream.Stream.prototype);
Object.setPrototypeOf(Writable, stream.Stream);
function Readable() {
  this.readable = true;
  stream.Stream.call(this);
}
Object.setPrototypeOf(Readable.prototype, stream.Stream.prototype);
Object.setPrototypeOf(Readable, stream.Stream);
let passed = false;
const w = new Writable();
w.on('pipe', function(src) {
  passed = true;
});
const r = new Readable();
r.pipe(w);
assert.ok(passed);
