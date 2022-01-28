'use strict';
if (common.isWindows) {
  common.skip('Win32 uses ACLs for file permissions, ' +
              'read access.');
}
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const Duplex = require('stream').Duplex;
const stream = new Duplex();
stream.pause = stream.resume = () => {};
stream._read = function() {
  this.push(null);
};
stream._write = function(c, e, cb) {
  cb();
};
stream.readable = stream.writable = true;
tmpdir.refresh();
const replHistoryPath = path.join(tmpdir.path, '.node_repl_history');
const checkResults = common.mustSucceed((r) => {
  const stat = fs.statSync(replHistoryPath);
  const fileMode = stat.mode & 0o777;
  assert.strictEqual(
    fileMode, 0o600,
    `REPL history file should be mode 0600 but was 0${fileMode.toString(8)}`);
  r.input.emit('keypress', '', { ctrl: true, name: 'd' });
  r.input.end();
});
repl.createInternalRepl(
  { NODE_REPL_HISTORY: replHistoryPath },
  {
    terminal: true,
    input: stream,
    output: stream
  },
  checkResults
);
