'use strict';
const {
  mustCall,
  mustCallAtLeast,
  mustNotCall,
const assert = require('assert');
const debug = require('util').debuglog('test');
const spawn = require('child_process').spawn;
const cat = spawn('cat');
cat.stdin.write('hello');
cat.stdin.write(' ');
cat.stdin.write('world');
assert.strictEqual(cat.stdin.writable, true);
assert.strictEqual(cat.stdin.readable, false);
cat.stdin.end();
let response = '';
cat.stdout.setEncoding('utf8');
cat.stdout.on('data', mustCallAtLeast((chunk) => {
  debug(`stdout: ${chunk}`);
  response += chunk;
}));
cat.stdout.on('end', mustCall());
cat.stderr.on('data', mustNotCall());
cat.stderr.on('end', mustCall());
cat.on('exit', mustCall((status) => {
  assert.strictEqual(status, 0);
}));
cat.on('close', mustCall(() => {
  assert.strictEqual(response, 'hello world');
}));
