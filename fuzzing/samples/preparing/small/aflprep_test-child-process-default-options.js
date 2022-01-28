'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const debug = require('util').debuglog('test');
process.env.HELLO = 'WORLD';
let child;
if (isWindows) {
} else {
}
let response = '';
child.stdout.setEncoding('utf8');
child.stdout.on('data', function(chunk) {
  debug(`stdout: ${chunk}`);
  response += chunk;
});
process.on('exit', function() {
  assert.ok(response.includes('HELLO=WORLD'),
            'spawn did not use process.env as default ' +
            `(process.env.HELLO = ${process.env.HELLO})`);
});
