'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const inspector = require('inspector');
const session = new inspector.Session();
session.connect();
const chunks = [];
session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  chunks.push(m.params.chunk);
});
session.post('HeapProfiler.takeHeapSnapshot', null, common.mustSucceed((r) => {
  assert.deepStrictEqual(r, {});
  session.disconnect();
  const profile = JSON.parse(chunks.join(''));
  assert(profile.snapshot.meta);
  assert(profile.snapshot.node_count > 0);
  assert(profile.snapshot.edge_count > 0);
}));
