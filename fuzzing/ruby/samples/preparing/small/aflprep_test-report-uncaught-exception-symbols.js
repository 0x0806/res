'use strict';
const assert = require('assert');
const exception = Symbol('foobar');
tmpdir.refresh();
process.report.directory = tmpdir.path;
process.on('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err, exception);
  const reports = helper.findReports(process.pid, tmpdir.path);
  assert.strictEqual(reports.length, 1);
  helper.validate(reports[0], [
    ['header.event', 'Exception'],
    ['javascriptStack.message', 'Symbol(foobar)'],
  ]);
}));
throw exception;
