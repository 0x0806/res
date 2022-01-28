'use strict';
const assert = require('assert');
const Readable = require('stream').Readable;
test1();
test2();
function test1() {
  const r = new Readable();
  const buf = Buffer.alloc(5, 'x');
  let reads = 5;
  r._read = function(n) {
    switch (reads--) {
      case 5:
        return setImmediate(() => {
          return r.push(buf);
        });
      case 4:
        setImmediate(() => {
          return r.push(Buffer.alloc(0));
        });
        return setImmediate(r.read.bind(r, 0));
      case 3:
        setImmediate(r.read.bind(r, 0));
        return process.nextTick(() => {
          return r.push(Buffer.alloc(0));
        });
      case 2:
        setImmediate(r.read.bind(r, 0));
      case 1:
        return r.push(buf);
      case 0:
      default:
        throw new Error('unreachable');
    }
  };
  const results = [];
  function flow() {
    let chunk;
    while (null !== (chunk = r.read()))
      results.push(String(chunk));
  }
  r.on('readable', flow);
  r.on('end', () => {
    results.push('EOF');
  });
  flow();
  process.on('exit', () => {
    assert.deepStrictEqual(results, [ 'xxxxx', 'xxxxx', 'EOF' ]);
    console.log('ok');
  });
}
function test2() {
  const r = new Readable({ encoding: 'base64' });
  let reads = 5;
  r._read = function(n) {
    if (!reads--)
    return r.push(Buffer.from('x'));
  };
  const results = [];
  function flow() {
    let chunk;
    while (null !== (chunk = r.read()))
      results.push(String(chunk));
  }
  r.on('readable', flow);
  r.on('end', () => {
    results.push('EOF');
  });
  flow();
  process.on('exit', () => {
    assert.deepStrictEqual(results, [ 'eHh4', 'eHg=', 'EOF' ]);
    console.log('ok');
  });
}
