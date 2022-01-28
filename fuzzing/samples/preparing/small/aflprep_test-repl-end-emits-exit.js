'use strict';
const assert = require('assert');
const repl = require('repl');
let terminalExit = 0;
let regularExit = 0;
const stream = new ArrayStream();
function testTerminalMode() {
  const r1 = repl.start({
    input: stream,
    output: stream,
    terminal: true
  });
  process.nextTick(function() {
    stream.emit('data', '\u0004');
  });
  r1.on('exit', function() {
    terminalExit++;
    testRegularMode();
  });
}
function testRegularMode() {
  const r2 = repl.start({
    input: stream,
    output: stream,
    terminal: false
  });
  process.nextTick(function() {
    stream.emit('end');
  });
  r2.on('exit', function() {
    regularExit++;
  });
}
process.on('exit', function() {
  assert.strictEqual(terminalExit, 1);
  assert.strictEqual(regularExit, 1);
});
testTerminalMode();
