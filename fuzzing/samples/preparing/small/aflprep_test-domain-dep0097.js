'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const domain = require('domain');
const inspector = require('inspector');
process.on('warning', common.mustCall((warning) => {
  assert.strictEqual(warning.code, 'DEP0097');
}));
domain.create().run(() => {
  inspector.open();
});
