'use strict';
const assert = require('assert');
const Process = internalBinding('process_wrap').Process;
const { Pipe, constants: PipeConstants } = internalBinding('pipe_wrap');
const pipe = new Pipe(PipeConstants.SOCKET);
const p = new Process();
let processExited = false;
let gotPipeEOF = false;
let gotPipeData = false;
p.onexit = function(exitCode, signal) {
  console.log('exit');
  p.close();
  pipe.readStart();
  assert.strictEqual(exitCode, 0);
  assert.strictEqual(signal, '');
  processExited = true;
};
pipe.onread = function(arrayBuffer) {
  assert.ok(processExited);
  if (arrayBuffer) {
    gotPipeData = true;
  } else {
    gotPipeEOF = true;
    pipe.close();
  }
};
p.spawn({
  file: process.execPath,
  args: [process.execPath, '-v'],
  stdio: [
    { type: 'ignore' },
    { type: 'pipe', handle: pipe },
    { type: 'ignore' },
  ]
});
assert.throws(function() {
  const notp = { spawn: p.spawn };
  notp.spawn({
    file: process.execPath,
    args: [process.execPath, '-v'],
    stdio: [
      { type: 'ignore' },
      { type: 'pipe', handle: pipe },
      { type: 'ignore' },
    ]
  });
}, TypeError);
process.on('exit', function() {
  assert.ok(processExited);
  assert.ok(gotPipeEOF);
  assert.ok(gotPipeData);
});
