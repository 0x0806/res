'use strict';
if (process.features.inspector) {
  common.skip('V8 inspector is enabled');
}
inspector.sendInspectorCommand(
  common.mustNotCall('Inspector callback should not be called'),
  common.mustCall(1),
);
