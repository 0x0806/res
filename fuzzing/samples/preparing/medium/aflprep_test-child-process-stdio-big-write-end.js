'use strict';
const {
  mustCall,
  mustCallAtLeast,
const assert = require('assert');
const debug = require('util').debuglog('test');
let bufsize = 0;
switch (process.argv[2]) {
  case undefined:
    return parent();
  case 'child':
    return child();
  default:
    throw new Error('invalid');
}
function parent() {
  const spawn = require('child_process').spawn;
  const child = spawn(process.execPath, [__filename, 'child']);
  let sent = 0;
  let n = '';
  child.stdout.setEncoding('ascii');
  child.stdout.on('data', mustCallAtLeast((c) => {
    n += c;
  }));
  child.stdout.on('end', mustCall(() => {
    assert.strictEqual(+n, sent);
    debug('ok');
  }));
  let buf;
  do {
    bufsize += 1024;
    buf = Buffer.alloc(bufsize, '.');
    sent += bufsize;
  } while (child.stdin.write(buf));
  for (let i = 0; i < 100; i++) {
    const buf = Buffer.alloc(bufsize, '.');
    sent += bufsize;
    child.stdin.write(buf);
  }
  child.stdin.end();
}
function child() {
  let received = 0;
  process.stdin.on('data', mustCallAtLeast((c) => {
    received += c.length;
  }));
  process.stdin.on('end', mustCall(() => {
    console.log(received);
  }));
}
