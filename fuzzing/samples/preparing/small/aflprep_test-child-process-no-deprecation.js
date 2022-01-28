'use strict';
process.noDeprecation = true;
if (process.argv[2] === 'child') {
  process.emitWarning('Something else is deprecated.', 'DeprecationWarning');
} else {
  const spawn = require('child_process').spawn;
  const child = spawn(process.execPath, [process.argv[1], 'child']);
  child.stderr.on('data', common.mustNotCall());
}
