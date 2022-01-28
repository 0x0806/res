'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isWorker) {
  const result = cluster.worker.send({
    prop: process.env.cluster_test_prop,
    overwrite: process.env.cluster_test_overwrite
  });
  assert.strictEqual(result, true);
} else if (cluster.isPrimary) {
  const checks = {
    using: false,
    overwrite: false
  };
  process.env.cluster_test_overwrite = 'old';
  const worker = cluster.fork({
    'cluster_test_prop': 'custom',
    'cluster_test_overwrite': 'new'
  });
  worker.on('message', function(data) {
    checks.using = (data.prop === 'custom');
    checks.overwrite = (data.overwrite === 'new');
    process.exit(0);
  });
  process.once('exit', function() {
    assert.ok(checks.using, 'The worker did not receive the correct env.');
    assert.ok(
      checks.overwrite,
      'The custom environment did not overwrite the existing environment.');
  });
}
