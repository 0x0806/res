'use strict';
const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const CODE =
  'setTimeout(() => { for (let i = 0; i < 100000; i++) { "test" + i } }, 1)';
const proc = cp.spawn(process.execPath, [
  '--trace-events-enabled',
  '--trace-event-file-pattern',
  '${pid}-${rotation}-${pid}-${rotation}.tracing.log',
  '-e', CODE,
], { cwd: tmpdir.path });
proc.once('exit', common.mustCall(() => {
  const expectedFilename = path.join(tmpdir.path,
                                     `${proc.pid}-1-${proc.pid}-1.tracing.log`);
  assert(fs.existsSync(expectedFilename));
  fs.readFile(expectedFilename, common.mustCall((err, data) => {
    const traces = JSON.parse(data.toString()).traceEvents;
    assert(traces.length > 0);
  }));
}));
