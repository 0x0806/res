'use strict';
const assert = require('assert');
const error = new Error('test error');
tmpdir.refresh();
process.report.directory = tmpdir.path;
process.setUncaughtExceptionCaptureCallback(common.mustCall());
process.on('uncaughtException', common.mustNotCall());
process.on('exit', (code) => {
  assert.strictEqual(code, 0);
  const reports = helper.findReports(process.pid, tmpdir.path);
  assert.strictEqual(reports.length, 0);
});
throw error;
