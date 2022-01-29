'use strict';
const assert = require('assert');
const error = new Error('test error');
tmpdir.refresh();
process.report.directory = tmpdir.path;
process.on('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err, error);
  const reports = helper.findReports(process.pid, tmpdir.path);
  assert.strictEqual(reports.length, 1);
  helper.validate(reports[0]);
}));
throw error;
