'use strict';
const assert = require('assert');
const cluster = require('cluster');
const fork = cluster.fork;
if (cluster.isPrimary) {
  cluster.disconnect(common.mustCall(() => {
    assert.deepStrictEqual(Object.keys(cluster.workers), []);
  }));
}
