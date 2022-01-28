'use strict';
const assert = require('assert');
const childProcess = require('child_process');
if (process.argv[2] === 'pipe') {
  process.stdout.write('stdout message');
  process.stderr.write('stderr message');
} else if (process.argv[2] === 'ipc') {
  process.send('message from child');
  process.on('message', function() {
    process.send('got message from primary');
  });
} else if (process.argv[2] === 'primary') {
  const child = childProcess.fork(process.argv[1], ['pipe'], { silent: true });
  child.disconnect();
  child.on('exit', function() {
    process.exit(0);
  });
} else {
  const args = [process.argv[1], 'primary'];
  const primary = childProcess.spawn(process.execPath, args);
  let stdoutData = false;
  primary.stdout.on('data', function() {
    stdoutData = true;
  });
  let stderrData = false;
  primary.stderr.on('data', function() {
    stderrData = true;
  });
  const child = childProcess.fork(process.argv[1], ['ipc'], { silent: true });
  child.stderr.pipe(process.stderr, { end: false });
  child.stdout.pipe(process.stdout, { end: false });
  let childSending = false;
  let childReceiving = false;
  child.on('message', function(message) {
    if (childSending === false) {
      childSending = (message === 'message from child');
    }
    if (childReceiving === false) {
      childReceiving = (message === 'got message from primary');
    }
    if (childReceiving === true) {
      child.kill();
    }
  });
  child.send('message to child');
  process.on('exit', function() {
    child.kill();
    primary.kill();
    assert.ok(!stdoutData);
    assert.ok(!stderrData);
    assert.ok(childSending);
    assert.ok(childReceiving);
  });
}
