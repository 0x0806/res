'use strict';
const assert = require('assert');
const PassThrough = require('stream').PassThrough;
const readline = require('readline');
common.skipIfDumbTerminal();
const iStream = new PassThrough();
const oStream = new PassThrough();
readline.createInterface({
  terminal: true,
  input: iStream,
  output: oStream,
  completer: function(line, cb) {
    cb(null, [['process.stdout', 'process.stdin', 'process.stderr'], line]);
  }
});
let output = '';
oStream.on('data', function(data) {
  output += data;
});
oStream.on('end', common.mustCall(() => {
  const expect = 'process.stdout\r\n' +
                 'process.stdin\r\n' +
                 'process.stderr';
  assert.match(output, new RegExp(expect));
}));
iStream.write('process.s\t');
iStream.write('\t');
oStream.end();
