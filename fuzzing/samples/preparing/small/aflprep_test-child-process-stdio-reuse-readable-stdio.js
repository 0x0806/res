'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const p1 = spawn('cat', { stdio: ['pipe', 'pipe', 'inherit'] });
const p2 = spawn('head', ['-n1'], { stdio: [p1.stdout, 'pipe', 'inherit'] });
p1.stdin.write('hello\n');
p2.stdout.setEncoding('utf8');
p2.stdout.on('data', common.mustCall((chunk) => {
  assert.strictEqual(chunk, 'hello\n');
}));
p2.on('exit', common.mustCall(() => {
  p1.stdin.end('world\n');
  p1.stdout.setEncoding('utf8');
  p1.stdout.on('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk, 'world\n');
  }));
  p1.stdout.resume();
}));
