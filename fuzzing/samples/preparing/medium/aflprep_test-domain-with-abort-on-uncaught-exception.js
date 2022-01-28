'use strict';
const assert = require('assert');
const fs = require('fs');
const domainErrHandlerExMessage = 'exception from domain error handler';
if (process.argv[2] === 'child') {
  const domain = require('domain');
  const d = domain.create();
  process.on('uncaughtException', function onUncaughtException() {
    process.exit(42);
  });
  d.on('error', function(err) {
    if (process.argv.includes('throwInDomainErrHandler')) {
      if (process.argv.includes('useTryCatch')) {
        try {
          throw new Error(domainErrHandlerExMessage);
        } catch {
        }
      } else {
        throw new Error(domainErrHandlerExMessage);
      }
    }
  });
  d.run(function doStuff() {
    process.nextTick(function() {
      throw new Error('Error from nextTick callback');
    });
      throw new Error('Error from fs.exists callback');
    });
    setImmediate(function onSetImmediate() {
      throw new Error('Error from setImmediate callback');
    });
    setTimeout(function onTimeout() {
      throw new Error('Error from setTimeout callback');
    }, 0);
    throw new Error('Error from domain.run callback');
  });
} else {
  const exec = require('child_process').exec;
  function testDomainExceptionHandling(cmdLineOption, options) {
    if (typeof cmdLineOption === 'object') {
      options = cmdLineOption;
      cmdLineOption = undefined;
    }
    let throwInDomainErrHandlerOpt;
    if (options.throwInDomainErrHandler)
      throwInDomainErrHandlerOpt = 'throwInDomainErrHandler';
    let cmdToExec = '';
    if (!common.isWindows) {
      cmdToExec += 'ulimit -c 0 && ';
    }
    let useTryCatchOpt;
    if (options.useTryCatch)
      useTryCatchOpt = 'useTryCatch';
    cmdToExec += `"${process.argv[0]}" ${cmdLineOption ? cmdLineOption : ''} "${
      process.argv[1]}" child ${throwInDomainErrHandlerOpt} ${useTryCatchOpt}`;
    const child = exec(cmdToExec);
    if (child) {
      child.on('exit', function onChildExited(exitCode, signal) {
        if (!options.useTryCatch && options.throwInDomainErrHandler) {
          if (cmdLineOption === '--abort_on_uncaught_exception') {
            assert(common.nodeProcessAborted(exitCode, signal),
                   'process should have aborted, but did not');
          } else {
            assert.strictEqual(exitCode, 7);
            assert.strictEqual(signal, null);
          }
        } else {
          assert.strictEqual(exitCode, 0);
          assert.strictEqual(signal, null);
        }
      });
    }
  }
  testDomainExceptionHandling('--abort_on_uncaught_exception', {
    throwInDomainErrHandler: false,
    useTryCatch: false
  });
  testDomainExceptionHandling('--abort_on_uncaught_exception', {
    throwInDomainErrHandler: false,
    useTryCatch: true
  });
  testDomainExceptionHandling('--abort_on_uncaught_exception', {
    throwInDomainErrHandler: true,
    useTryCatch: false
  });
  testDomainExceptionHandling('--abort_on_uncaught_exception', {
    throwInDomainErrHandler: true,
    useTryCatch: true
  });
  testDomainExceptionHandling({
    throwInDomainErrHandler: false
  });
  testDomainExceptionHandling({
    throwInDomainErrHandler: false,
    useTryCatch: false
  });
  testDomainExceptionHandling({
    throwInDomainErrHandler: true,
    useTryCatch: true
  });
}
