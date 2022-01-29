'use strict';
const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const CODE =
  'setTimeout(() => { for (let i = 0; i < 100000; i++) { "test" + i } }, 1)';
tmpdir.refresh();
const FILE_NAME = path.join(tmpdir.path, 'node_trace.1.log');
const proc = cp.spawn(process.execPath,
                      [ '--trace-event-categories', 'node.async_hooks',
                        '-e', CODE ],
                      { cwd: tmpdir.path });
proc.once('exit', common.mustCall(() => {
  assert(fs.existsSync(FILE_NAME));
  fs.readFile(FILE_NAME, common.mustCall((err, data) => {
    const traces = JSON.parse(data.toString()).traceEvents;
    assert(traces.length > 0);
    assert(!traces.some((trace) => {
      if (trace.pid !== proc.pid)
        return false;
      if (trace.cat !== 'v8')
        return false;
      if (trace.name !== 'V8.ScriptCompiler')
        return false;
      return true;
    }));
    assert(traces.some((trace) => {
      if (trace.pid !== proc.pid)
        return false;
      if (trace.cat !== 'node,node.async_hooks')
        return false;
      return true;
    }));
    assert(traces.some((trace) => {
      if (trace.pid !== proc.pid)
        return false;
      if (trace.cat !== 'node,node.async_hooks')
        return false;
      if (trace.name !== 'Timeout')
        return false;
      return true;
    }));
    const initEvents = traces.filter((trace) => {
      return (trace.ph === 'b' && !trace.name.includes('_CALLBACK'));
    });
    assert.ok(initEvents.every((trace) => {
      return (trace.args.data.executionAsyncId > 0 &&
              trace.args.data.triggerAsyncId > 0);
    }), `Unexpected initEvents format: ${util.inspect(initEvents)}`);
  }));
}));
