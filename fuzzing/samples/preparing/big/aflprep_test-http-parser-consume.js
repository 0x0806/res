'use strict';
const assert = require('assert');
const { createServer, get } = require('http');
const { spawn } = require('child_process');
if (process.argv[2] === 'child') {
  const server = createServer(common.mustCall((_, res) => res.end('h')));
  server.listen(0, common.mustCall(() => {
    const rr = get({ port: server.address().port }, common.mustCall(() => {
      rr.parser.consume(0);
      assert.fail('this should be unreachable');
    }));
  }));
} else {
  const child = spawn(process.execPath, [__filename, 'child']);
  child.stdout.on('data', common.mustNotCall());
  let stderr = '';
  child.stderr.on('data', common.mustCallAtLeast((data) => {
    assert(Buffer.isBuffer(data));
    stderr += data.toString('utf8');
  }, 1));
  child.on('exit', common.mustCall((code, signal) => {
    assert(stderr.includes('failed'), `stderr: ${stderr}`);
    const didAbort = common.nodeProcessAborted(code, signal);
    assert(didAbort, `process did not abort, code:${code} signal:${signal}`);
  }));
}
