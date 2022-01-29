'use strict';
const {
  mustCall,
  mustNotCall,
const assert = require('assert');
const debug = require('util').debuglog('test');
const { spawn } = require('child_process');
const sub = fixtures.path('echo.js');
const child = spawn(process.argv[0], [sub]);
child.stderr.on('data', mustNotCall());
child.stdout.setEncoding('utf8');
const messages = [
  'hello world\r\n',
  'echo me\r\n',
];
child.stdout.on('data', mustCall((data) => {
  debug(`child said: ${JSON.stringify(data)}`);
  const test = messages.shift();
  debug(`testing for '${test}'`);
  assert.strictEqual(data, test);
  if (messages.length) {
    debug(`writing '${messages[0]}'`);
    child.stdin.write(messages[0]);
  } else {
    assert.strictEqual(messages.length, 0);
    child.stdin.end();
  }
}, messages.length));
child.stdout.on('end', mustCall((data) => {
  debug('child end');
}));
