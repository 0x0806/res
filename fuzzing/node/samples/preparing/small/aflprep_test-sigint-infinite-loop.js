'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
console.log('start');
const c = spawn(process.execPath, ['-e', 'while(true) { console.log("hi"); }']);
let sentKill = false;
c.stdout.on('data', function(s) {
  if (!sentKill) {
    c.kill('SIGINT');
    console.log('SIGINT infinite-loop.js');
    sentKill = true;
  }
});
c.on('exit', common.mustCall(function(code) {
  assert.ok(code !== 0);
  console.log('killed infinite-loop.js');
}));
process.on('exit', function() {
  assert.ok(sentKill);
});
