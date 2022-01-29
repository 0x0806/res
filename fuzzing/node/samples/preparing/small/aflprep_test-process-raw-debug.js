'use strict';
const assert = require('assert');
const os = require('os');
switch (process.argv[2]) {
  case 'child':
    return child();
  case undefined:
    return parent();
  default:
    throw new Error(`invalid: ${process.argv[2]}`);
}
function parent() {
  const spawn = require('child_process').spawn;
  const child = spawn(process.execPath, [__filename, 'child']);
  let output = '';
  child.stderr.on('data', function(c) {
    output += c;
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('end', function() {
    assert.strictEqual(output, `I can still debug!${os.EOL}`);
    console.log('ok - got expected message');
  });
  child.on('exit', common.mustCall(function(c) {
    assert(!c);
    console.log('ok - child exited nicely');
  }));
}
function child() {
  process.nextTick = function() {
    throw new Error('No ticking!');
  };
  hijackStderr(common.mustNotCall('stderr.write must not be called.'));
  process._rawDebug('I can still %s!', 'debug');
}
