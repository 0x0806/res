'use strict';
const assert = require('assert');
const exec = require('child_process').exec;
let pwdcommand, dir;
if (common.isWindows) {
  pwdcommand = 'echo %cd%';
  dir = 'c:\\windows';
} else {
  pwdcommand = 'pwd';
}
exec(pwdcommand, { cwd: dir }, common.mustSucceed((stdout, stderr) => {
  assert(stdout.startsWith(dir));
}));
