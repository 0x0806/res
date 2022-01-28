'use strict';
common.skipIfInspectorDisabled();
if (common.isWindows)
  common.skip('test does not apply to Windows');
common.expectWarning('Warning',
                     'process.on(SIGPROF) is reserved while debugging');
process.on('SIGPROF', () => {});
