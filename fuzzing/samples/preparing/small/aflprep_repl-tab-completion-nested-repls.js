'use strict';
const { Stream } = require('stream');
function noop() {}
function ArrayStream() {
  this.run = function(data) {
    data.forEach((line) => {
      this.emit('data', `${line}\n`);
    });
  };
}
Object.setPrototypeOf(ArrayStream.prototype, Stream.prototype);
Object.setPrototypeOf(ArrayStream, Stream);
ArrayStream.prototype.readable = true;
ArrayStream.prototype.writable = true;
ArrayStream.prototype.pause = noop;
ArrayStream.prototype.resume = noop;
ArrayStream.prototype.write = noop;
const repl = require('repl');
const putIn = new ArrayStream();
const testMe = repl.start('', putIn);
testMe._domain.on('error', function(err) {
  throw err;
});
putIn.run([
  'var top = function() {',
  'r = function test (',
  ' one, two) {',
  'var inner = {',
  ' one:1',
  '};'
]);
testMe.complete('inner.o', () => { throw new Error('fhqwhgads'); });