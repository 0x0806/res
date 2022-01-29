'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
const p3 = spawn('cat', { stdio: ['pipe', 'pipe', 'inherit'] });
const p1 = spawn('cat', { stdio: ['pipe', p3.stdin, 'inherit'] });
const p2 = spawn('cat', { stdio: ['pipe', p3.stdin, 'inherit'] });
p3.stdout.setEncoding('utf8');
p1.stdin.end('hello\n');
p3.stdout.once('data', common.mustCall((chunk) => {
  assert.strictEqual(chunk, 'hello\n');
  p2.stdin.end('world\n');
  p3.stdout.once('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk, 'world\n');
    p3.stdin.end('foobar\n');
    p3.stdout.once('data', common.mustCall((chunk) => {
      assert.strictEqual(chunk, 'foobar\n');
    }));
  }));
}));
