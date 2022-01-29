'use strict';
const assert = require('assert');
{
  helper.validateContent(process.report.getReport());
  assert.deepStrictEqual(helper.findReports(process.pid, process.cwd()), []);
}
{
  helper.validateContent(process.report.getReport(new Error('test error')));
  assert.deepStrictEqual(helper.findReports(process.pid, process.cwd()), []);
}
{
  const error = new Error();
  error.stack = 'only one line';
  helper.validateContent(process.report.getReport(error));
  assert.deepStrictEqual(helper.findReports(process.pid, process.cwd()), []);
}
{
  const error = new Error();
  error.foo = 'goo';
  helper.validateContent(process.report.getReport(error),
                         [['javascriptStack.errorProperties.foo', 'goo']]);
}
[null, 1, Symbol(), function() {}, 'foo'].forEach((error) => {
  assert.throws(() => {
    process.report.getReport(error);
  }, { code: 'ERR_INVALID_ARG_TYPE' });
});
