'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const inspector = require('inspector');
const stream = require('stream');
const { Worker, workerData } = require('worker_threads');
const session = new inspector.Session();
session.connect();
session.post('HeapProfiler.enable');
session.post('HeapProfiler.startTrackingHeapObjects',
             { trackAllocations: true });
const interval = setInterval(() => {
  new stream.PassThrough().end('abc').on('data', common.mustCall());
}, 1);
setTimeout(() => {
  clearInterval(interval);
  if (workerData === 'stopEarly')
    process.exit();
  let data = '';
  session.on('HeapProfiler.addHeapSnapshotChunk',
             common.mustCallAtLeast((event) => {
               data += event.params.chunk;
             }));
  session.post('HeapProfiler.stopTrackingHeapObjects');
  assert(data.includes('PassThrough'), data);
  new Worker(__filename, { workerData: 'stopEarly' });
}, 100);
