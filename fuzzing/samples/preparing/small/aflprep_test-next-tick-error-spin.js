'use strict';
const assert = require('assert');
if (process.argv[2] !== 'child') {
  const spawn = require('child_process').spawn;
  const child = spawn(process.execPath, [__filename, 'child'], {
  });
  const timer = setTimeout(function() {
    throw new Error('child is hung');
  }, common.platformTimeout(3000));
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
    clearTimeout(timer);
  }));
} else {
  const domain = require('domain');
  const d = domain.create();
  d.on('error', function() {
    console.log('a');
    console.log('b');
    console.log('c');
    console.log('d');
    console.log('e');
    f();
  });
  function f() {
    process.nextTick(function() {
      d.run(function() {
        throw new Error('x');
      });
    });
  }
  f();
  setImmediate(function() {
    console.error('broke in!');
    process.exit(0);
  });
}
