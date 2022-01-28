'use strict';
const assert = require('assert');
const child_process = require('child_process');
const domain = require('domain');
const uncaughtExceptionHandlerErrMsg = 'boom from uncaughtException handler';
const domainErrMsg = 'boom from domain';
const RAN_UNCAUGHT_EXCEPTION_HANDLER_EXIT_CODE = 42;
if (process.argv[2] === 'child') {
  process.on('uncaughtException', common.mustCall(function onUncaught() {
    if (process.execArgv.includes('--abort-on-uncaught-exception')) {
      process.exit(RAN_UNCAUGHT_EXCEPTION_HANDLER_EXIT_CODE);
    } else {
      throw new Error(uncaughtExceptionHandlerErrMsg);
    }
  }));
  const d = domain.create();
  d.run(common.mustCall(function() {
    throw new Error(domainErrMsg);
  }));
} else {
  runTestWithoutAbortOnUncaughtException();
  runTestWithAbortOnUncaughtException();
}
function runTestWithoutAbortOnUncaughtException() {
  child_process.exec(
    createTestCmdLine(),
    function onTestDone(err, stdout, stderr) {
      assert(stderr.includes(uncaughtExceptionHandlerErrMsg),
             'stderr output must include proper uncaughtException ' +
             'handler\'s error\'s message');
      assert(!stderr.includes(domainErrMsg),
             'stderr output must not include domain\'s error\'s message');
      assert.notStrictEqual(err.code, 0,
                            'child process should have exited with a ' +
                            'non-zero exit code, but did not');
    }
  );
}
function runTestWithAbortOnUncaughtException() {
  child_process.exec(createTestCmdLine({
    withAbortOnUncaughtException: true
  }), function onTestDone(err, stdout, stderr) {
    assert.notStrictEqual(err.code, RAN_UNCAUGHT_EXCEPTION_HANDLER_EXIT_CODE,
                          'child process should not have run its ' +
                          'uncaughtException event handler');
    assert(common.nodeProcessAborted(err.code, err.signal),
           'process should have aborted, but did not');
  });
}
function createTestCmdLine(options) {
  let testCmd = '';
  if (!common.isWindows) {
    testCmd += 'ulimit -c 0 && ';
  }
  testCmd += `"${process.argv[0]}"`;
  if (options && options.withAbortOnUncaughtException) {
    testCmd += ' --abort-on-uncaught-exception';
  }
  testCmd += ` "${process.argv[1]}" child`;
  return testCmd;
}
