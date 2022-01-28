'use strict';
if (module !== require.main) {
  console.log('Loaded as a module, exiting with status code 42.');
  process.exit(42);
}
const assert = require('assert');
const child = require('child_process');
const path = require('path');
const nodejs = `"${process.execPath}"`;
if (process.argv.length > 2) {
  console.log(process.argv.slice(2).join(' '));
  process.exit(0);
}
child.exec(`${nodejs} --eval 42`, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(stdout, '');
  assert.strictEqual(stderr, '');
}));
child.exec(`${nodejs} --eval "console.error(42)"`,
           common.mustSucceed((stdout, stderr) => {
             assert.strictEqual(stdout, '');
             assert.strictEqual(stderr, '42\n');
           }));
['--print', '-p -e', '-pe', '-p'].forEach((s) => {
  const cmd = `${nodejs} ${s} `;
  child.exec(`${cmd}42`, common.mustSucceed((stdout, stderr) => {
    assert.strictEqual(stdout, '42\n');
    assert.strictEqual(stderr, '');
  }));
  child.exec(`${cmd} '[]'`, common.mustSucceed((stdout, stderr) => {
    assert.strictEqual(stdout, '[]\n');
    assert.strictEqual(stderr, '');
  }));
});
{
  child.exec(`${nodejs} --eval "require('${filename}')"`,
             common.mustCall((err, stdout, stderr) => {
               assert.strictEqual(err.code, 42);
               assert.strictEqual(
                 stdout, 'Loaded as a module, exiting with status code 42.\n');
               assert.strictEqual(stderr, '');
             }));
}
child.exec(`${nodejs} --print "os.platform()"`,
           common.mustSucceed((stdout, stderr) => {
             assert.strictEqual(stderr, '');
             assert.strictEqual(stdout.trim(), require('os').platform());
           }));
           common.mustCall((err, stdout, stderr) => {
             assert.strictEqual(err.code, 42);
             assert.strictEqual(
               stdout, 'Loaded as a module, exiting with status code 42.\n');
             assert.strictEqual(stderr, '');
           }));
child.exec(`${nodejs} -e`, common.mustCall((err, stdout, stderr) => {
  assert.strictEqual(err.code, 9);
  assert.strictEqual(stdout, '');
  assert.strictEqual(stderr.trim(),
                     `${process.execPath}: -e requires an argument`);
}));
child.exec(`${nodejs} -e ""`, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(stdout, '');
  assert.strictEqual(stderr, '');
}));
child.exec(`${nodejs} -p "\\-42"`, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(stdout, '-42\n');
  assert.strictEqual(stderr, '');
}));
child.exec(`${nodejs} --use-strict -p process.execArgv`,
           common.mustSucceed((stdout, stderr) => {
             assert.strictEqual(
               stdout, "[ '--use-strict', '-p', 'process.execArgv' ]\n"
             );
             assert.strictEqual(stderr, '');
           }));
{
  let emptyFile = fixtures.path('empty.js');
  if (common.isWindows) {
  }
  child.exec(`${nodejs} -e 'require("child_process").fork("${emptyFile}")'`,
             common.mustSucceed((stdout, stderr) => {
               assert.strictEqual(stdout, '');
               assert.strictEqual(stderr, '');
             }));
  child.exec(
    `${nodejs} -e "process.execArgv = ['-e', 'console.log(42)', 'thirdArg'];` +
                  `require('child_process').fork('${emptyFile}')"`,
    common.mustSucceed((stdout, stderr) => {
      assert.strictEqual(stdout, '42\n');
      assert.strictEqual(stderr, '');
    }));
}
{
  const script = `
      process.once("beforeExit", () => console.log("beforeExit"));
      process.on("exit", () => console.log("exit"));
      console.log("start");
  `;
  const options = { encoding: 'utf8' };
  const proc = child.spawnSync(process.execPath, ['-e', script], options);
  assert.strictEqual(proc.stderr, '');
  assert.strictEqual(proc.stdout, 'start\nbeforeExit\nexit\n');
}
{
  const script = `
      process.on('message', (message) => {
        if (message === 'ping') process.send('pong');
        if (message === 'exit') process.disconnect();
      });
  `;
  const proc = child.fork('-e', [script]);
  proc.on('exit', common.mustCall((exitCode, signalCode) => {
    assert.strictEqual(exitCode, 0);
    assert.strictEqual(signalCode, null);
  }));
  proc.on('message', (message) => {
    if (message === 'pong') proc.send('exit');
  });
  proc.send('ping');
}
[ '-arg1',
  '-arg1 arg2 --arg3',
  '--',
  'arg1 -- arg2',
].forEach(function(args) {
  const opt = ' --eval "console.log(process.argv.slice(1).join(\' \'))"';
  const cmd = `${nodejs}${opt} -- ${args}`;
  child.exec(cmd, common.mustCall(function(err, stdout, stderr) {
    assert.strictEqual(stdout, `${args}\n`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(err, null);
  }));
  const popt = ' --print "process.argv.slice(1).join(\' \')"';
  const pcmd = `${nodejs}${popt} -- ${args}`;
  child.exec(pcmd, common.mustCall(function(err, stdout, stderr) {
    assert.strictEqual(stdout, `${args}\n`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(err, null);
  }));
  const filecmd = `${nodejs} -- "${__filename}" ${args}`;
  child.exec(filecmd, common.mustCall(function(err, stdout, stderr) {
    assert.strictEqual(stdout, `${args}\n`);
    assert.strictEqual(stderr, '');
    assert.strictEqual(err, null);
  }));
});
const execOptions = '--input-type module';
child.exec(
  `${nodejs} ${execOptions} --eval "console.log(42)"`,
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, '42\n');
  }));
child.exec(
  `${nodejs} ${execOptions} --print --eval "42"`,
  common.mustCall((err, stdout, stderr) => {
    assert.ok(err);
    assert.strictEqual(stdout, '');
    assert.ok(stderr.includes('--print cannot be used with ESM input'));
  }));
child.exec(
  `${nodejs} ${execOptions} --eval "!!!!"`,
  common.mustCall((err, stdout, stderr) => {
    assert.ok(err);
    assert.strictEqual(stdout, '');
    assert.ok(stderr.indexOf('SyntaxError: Unexpected end of input') > 0);
  }));
child.exec(
  `${nodejs} ${execOptions} --eval "console.log(typeof require);"`,
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, 'undefined\n');
  }));
child.exec(
  `${nodejs} ${execOptions} --eval "console.log(typeof import.meta);"`,
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, 'object\n');
  }));
child.exec(
  `${nodejs} ${execOptions} ` +
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, '.mjs file\n');
  }));
child.exec(
  `${nodejs} ${execOptions} ` +
  '--eval "process.chdir(\'..\');' +
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, '.mjs file\n');
  }));
child.exec(
  `${nodejs} ` +
  '--eval "process.chdir(\'..\');' +
  common.mustSucceed((stdout) => {
    assert.strictEqual(stdout, '.mjs file\n');
  }));
