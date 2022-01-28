'use strict';
common.skipIfInspectorDisabled();
common.skipIfWorker();
const assert = require('assert');
const inspector = require('inspector');
const wsUrl = inspector.url();
assert.throws(() => {
  inspector.open(0, undefined, false);
}, {
  code: 'ERR_INSPECTOR_ALREADY_ACTIVATED'
});
assert.strictEqual(inspector.url(), wsUrl);
inspector.close();
assert.strictEqual(inspector.url(), undefined);
