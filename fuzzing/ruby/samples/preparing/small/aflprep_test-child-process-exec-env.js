'use strict';
const assert = require('assert');
const exec = require('child_process').exec;
const debug = require('util').debuglog('test');
let success_count = 0;
let error_count = 0;
let response = '';
let child;
function after(err, stdout, stderr) {
  if (err) {
    error_count++;
    debug(`error!: ${err.code}`);
    debug(`stdout: ${JSON.stringify(stdout)}`);
    debug(`stderr: ${JSON.stringify(stderr)}`);
    assert.strictEqual(err.killed, false);
  } else {
    success_count++;
    assert.notStrictEqual(stdout, '');
  }
}
if (!isWindows) {
} else {
  child = exec('set',
               { env: { ...process.env, 'HELLO': 'WORLD' } },
               after);
}
child.stdout.setEncoding('utf8');
child.stdout.on('data', function(chunk) {
  response += chunk;
});
process.on('exit', function() {
  debug('response: ', response);
  assert.strictEqual(success_count, 1);
  assert.strictEqual(error_count, 0);
  assert.ok(response.includes('HELLO=WORLD'));
});
