'use strict';
const assert = require('assert');
const { Readable, Writable } = require('stream');
const EE = require('events').EventEmitter;
const stream = new Readable({
  highWaterMark: 16,
  encoding: 'utf8'
});
const source = new EE();
stream._read = function() {
  console.error('stream._read');
  readStart();
};
let ended = false;
stream.on('end', function() {
  ended = true;
});
source.on('data', function(chunk) {
  const ret = stream.push(chunk);
  console.error('data', stream.readableLength);
  if (!ret)
    readStop();
});
source.on('end', function() {
  stream.push(null);
});
let reading = false;
function readStart() {
  console.error('readStart');
  reading = true;
}
function readStop() {
  console.error('readStop');
  reading = false;
  process.nextTick(function() {
    const r = stream.read();
    if (r !== null)
      writer.write(r);
  });
}
const writer = new Writable({
  decodeStrings: false
});
const written = [];
const expectWritten =
  [ 'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg',
    'asdfgasdfgasdfgasdfg' ];
writer._write = function(chunk, encoding, cb) {
  console.error(`WRITE ${chunk}`);
  written.push(chunk);
  process.nextTick(cb);
};
writer.on('finish', finish);
const chunk = 'asdfg';
let set = 0;
readStart();
data();
function data() {
  assert(reading);
  source.emit('data', chunk);
  assert(reading);
  source.emit('data', chunk);
  assert(reading);
  source.emit('data', chunk);
  assert(reading);
  source.emit('data', chunk);
  assert(!reading);
  if (set++ < 5)
    setTimeout(data, 10);
  else
    end();
}
function finish() {
  console.error('finish');
  assert.deepStrictEqual(written, expectWritten);
  console.log('ok');
}
function end() {
  source.emit('end');
  assert(!reading);
  writer.end(stream.read());
  setImmediate(function() {
    assert(ended);
  });
}
