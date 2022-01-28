'use strict';
const stream = require('stream');
const reader = new stream.Readable();
const writer1 = new stream.Writable();
const writer2 = new stream.Writable();
const buffer = Buffer.allocUnsafe(560000);
reader._read = () => {};
writer1._write = common.mustCall(function(chunk, encoding, cb) {
  this.emit('chunk-received');
  cb();
}, 1);
writer1.once('chunk-received', function() {
  reader.unpipe(writer1);
  reader.pipe(writer2);
  reader.push(buffer);
  setImmediate(function() {
    reader.push(buffer);
    setImmediate(function() {
      reader.push(buffer);
    });
  });
});
writer2._write = common.mustCall(function(chunk, encoding, cb) {
  cb();
}, 3);
reader.pipe(writer1);
reader.push(buffer);
