'use strict';
if (common.isWindows)
  return common.skip('Unsupported on Windows.');
if (!common.isMainThread)
  common.skip('Signal reporting is only supported in the main thread');
const assert = require('assert');
tmpdir.refresh();
process.report.directory = tmpdir.path;
assert.strictEqual(process.listenerCount('SIGUSR2'), 1);
process.kill(process.pid, 'SIGUSR2');
(function validate() {
  const reports = helper.findReports(process.pid, tmpdir.path);
  if (reports.length === 0)
    return setImmediate(validate);
  assert.strictEqual(reports.length, 1);
  helper.validate(reports[0]);
})();
