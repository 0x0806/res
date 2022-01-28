'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
const stream = new Readable();
let calledRead = false;
stream._read = function() {
  assert(!calledRead);
  calledRead = true;
  this.push(null);
};
stream.on('data', function() {
  throw new Error('should not ever get data');
});
stream.pause();
setTimeout(common.mustCall(function() {
  stream.on('end', common.mustCall());
  stream.resume();
}), 1);
process.on('exit', function() {
  assert(calledRead);
  console.log('ok');
});
