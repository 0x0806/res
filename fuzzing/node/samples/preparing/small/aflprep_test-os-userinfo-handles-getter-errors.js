'use strict';
const assert = require('assert');
const execFile = require('child_process').execFile;
const script = `os.userInfo({
  get encoding() {
    throw new Error('xyz');
  }
})`;
const node = process.execPath;
execFile(node, [ '-e', script ], common.mustCall((err, stdout, stderr) => {
  assert(stderr.includes('Error: xyz'), 'userInfo crashes');
}));
