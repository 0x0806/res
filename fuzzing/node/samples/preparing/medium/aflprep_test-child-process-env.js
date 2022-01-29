'use strict';
const {
  isWindows,
  mustCall,
  mustCallAtLeast,
const assert = require('assert');
const os = require('os');
const debug = require('util').debuglog('test');
const spawn = require('child_process').spawn;
const env = {
  ...process.env,
  'HELLO': 'WORLD',
  'UNDEFINED': undefined,
  'NULL': null,
  'EMPTY': '',
  'duplicate': 'lowercase',
  'DUPLICATE': 'uppercase',
};
Object.setPrototypeOf(env, {
  'FOO': 'BAR'
});
let child;
if (isWindows) {
} else {
}
let response = '';
child.stdout.setEncoding('utf8');
child.stdout.on('data', mustCallAtLeast((chunk) => {
  debug(`stdout: ${chunk}`);
  response += chunk;
}));
child.stdout.on('end', mustCall(() => {
  assert.ok(response.includes('HELLO=WORLD'));
  assert.ok(response.includes('FOO=BAR'));
  assert.ok(!response.includes('UNDEFINED=undefined'));
  assert.ok(response.includes('NULL=null'));
  assert.ok(response.includes(`EMPTY=${os.EOL}`));
  if (isWindows) {
    assert.ok(response.includes('DUPLICATE=uppercase'));
    assert.ok(!response.includes('duplicate=lowercase'));
  } else {
    assert.ok(response.includes('DUPLICATE=uppercase'));
    assert.ok(response.includes('duplicate=lowercase'));
  }
}));
