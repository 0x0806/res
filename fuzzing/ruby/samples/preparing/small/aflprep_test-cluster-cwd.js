'use strict';
const assert = require('assert');
const cluster = require('cluster');
if (cluster.isPrimary) {
  tmpdir.refresh();
  assert.strictEqual(cluster.settings.cwd, undefined);
  cluster.fork().on('message', common.mustCall((msg) => {
    assert.strictEqual(msg, process.cwd());
  }));
  cluster.setupPrimary({ cwd: tmpdir.path });
  assert.strictEqual(cluster.settings.cwd, tmpdir.path);
  cluster.fork().on('message', common.mustCall((msg) => {
    assert.strictEqual(msg, tmpdir.path);
  }));
} else {
  process.send(process.cwd());
  process.disconnect();
}
