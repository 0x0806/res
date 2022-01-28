'use strict';
if (common.isSunOS)
  common.skip(`Unsupported platform [${process.platform}]`);
if (common.isIBMi)
  common.skip('Unsupported platform IBMi');
if (!common.isMainThread)
  common.skip('Setting the process title from Workers is not supported');
const assert = require('assert');
const exec = require('child_process').exec;
const path = require('path');
let title = String(process.pid);
assert.notStrictEqual(process.title, title);
process.title = title;
assert.strictEqual(process.title, title);
if (common.isWindows)
  common.skip('Windows does not have "ps" utility');
const cmd = common.isLinux ?
  `ps -o pid,args | grep '${process.pid} ${title}' | grep -v grep` :
  `ps -p ${process.pid} -o args=`;
exec(cmd, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(stderr, '');
  if (common.isFreeBSD || common.isOpenBSD)
    title += ` (${path.basename(process.execPath)})`;
}));
