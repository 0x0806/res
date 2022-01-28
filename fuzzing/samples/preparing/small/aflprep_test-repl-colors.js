'use strict';
const { Duplex } = require('stream');
const { inspect } = require('util');
const { strictEqual } = require('assert');
const { REPLServer } = require('repl');
let output = '';
const inout = new Duplex({ decodeStrings: false });
inout._read = function() {
  this.push('util.inspect("string")\n');
  this.push(null);
};
inout._write = function(s, _, cb) {
  output += s;
  cb();
};
const repl = new REPLServer({ input: inout, output: inout, useColors: true });
inout.isTTY = true;
const repl2 = new REPLServer({ input: inout, output: inout });
process.on('exit', function() {
  strictEqual(output.includes(`"'string'"`), true);
  strictEqual(output.includes(`'\u001b[32m\\'string\\'\u001b[39m'`), false);
  strictEqual(inspect.defaultOptions.colors, false);
  strictEqual(repl.writer.options.colors, true);
  strictEqual(repl2.writer.options.colors, true);
});
