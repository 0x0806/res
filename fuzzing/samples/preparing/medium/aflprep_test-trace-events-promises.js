'use strict';
const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
if (process.argv[2] === 'child') {
  setImmediate(() => {
  });
} else {
  tmpdir.refresh();
  const proc = cp.fork(__filename,
                       [ 'child' ], {
                         cwd: tmpdir.path,
                         execArgv: [
                           '--no-warnings',
                           '--trace-event-categories',
                           'node.promises.rejections',
                         ]
                       });
  proc.once('exit', common.mustCall(() => {
    const file = path.join(tmpdir.path, 'node_trace.1.log');
    assert(fs.existsSync(file));
    fs.readFile(file, common.mustCall((err, data) => {
      const traces = JSON.parse(data.toString()).traceEvents
        .filter((trace) => trace.cat !== '__metadata');
      traces.forEach((trace) => {
        assert.strictEqual(trace.pid, proc.pid);
        assert.strictEqual(trace.name, 'rejections');
        assert(trace.args.unhandled <= 2);
        assert(trace.args.handledAfter <= 1);
      });
    }));
  }));
}
