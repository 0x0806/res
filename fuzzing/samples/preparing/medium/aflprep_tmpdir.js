'use strict';
const fs = require('fs');
const path = require('path');
const { isMainThread } = require('worker_threads');
function rmSync(pathname) {
  fs.rmSync(pathname, { maxRetries: 3, recursive: true, force: true });
}
const testRoot = process.env.NODE_TEST_DIR ?
  fs.realpathSync(process.env.NODE_TEST_DIR) : path.resolve(__dirname, '..');
const tmpdirName = '.tmp.' +
  (process.env.TEST_SERIAL_ID || process.env.TEST_THREAD_ID || '0');
const tmpPath = path.join(testRoot, tmpdirName);
let firstRefresh = true;
function refresh() {
  rmSync(this.path);
  fs.mkdirSync(this.path);
  if (firstRefresh) {
    firstRefresh = false;
    process.on('exit', onexit);
  }
}
function onexit() {
  if (isMainThread)
    process.chdir(testRoot);
  try {
    rmSync(tmpPath);
  } catch (e) {
    console.error('Can\'t clean tmpdir:', tmpPath);
    const files = fs.readdirSync(tmpPath);
    console.error('Files blocking:', files);
    if (files.some((f) => f.startsWith('.nfs'))) {
      console.error('Note: ".nfs*" might be files that were open and ' +
                    'unlinked but not closed.');
    }
    console.error();
    throw e;
  }
}
module.exports = {
  path: tmpPath,
  refresh
};
