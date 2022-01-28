'use strict';
if (common.isSunOS)
  common.skip('unreliable on SunOS');
const assert = require('assert');
const childProcess = require('child_process');
const nodeBinary = process.argv[0];
const preloadOption = (preloads) => {
  let option = '';
  preloads.forEach(function(preload, index) {
    option += `-r "${preload}" `;
  });
  return option;
};
const fixtureA = fixtures.path('printA.js');
const fixtureB = fixtures.path('printB.js');
const fixtureC = fixtures.path('printC.js');
const fixtureD = fixtures.path('define-global.js');
const fixtureE = fixtures.path('intrinsic-mutation.js');
const fixtureF = fixtures.path('print-intrinsic-mutation-name.js');
const fixtureG = fixtures.path('worker-from-argv.js');
const fixtureThrows = fixtures.path('throws_error4.js');
const fixtureIsPreloading = fixtures.path('ispreloading.js');
assert(!module.isPreloading);
childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureIsPreloading])} "${fixtureB}"`,
  function(err, stdout, stderr) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'B\n');
  });
childProcess.exec(`"${nodeBinary}" ${preloadOption([fixtureA])} "${fixtureB}"`,
                  function(err, stdout, stderr) {
                    assert.ifError(err);
                    assert.strictEqual(stdout, 'A\nB\n');
                  });
childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureA, fixtureB])} "${fixtureC}"`,
  function(err, stdout, stderr) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'A\nB\nC\n');
  }
);
childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureA, fixtureThrows])} "${fixtureB}"`,
  function(err, stdout, stderr) {
    if (err) {
      assert.strictEqual(stdout, 'A\n');
    } else {
      throw new Error('Preload should have failed');
    }
  }
);
childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureA])}-e "console.log('hello');"`,
  function(err, stdout, stderr) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'A\nhello\n');
  }
);
childProcess.exec(
  `"${nodeBinary}" --frozen-intrinsics ${
    preloadOption([fixtureE])
  } ${
    fixtureF
  }`,
  function(err, stdout) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'smoosh\n');
  }
);
childProcess.exec(
  `"${
    nodeBinary
  }" --frozen-intrinsics ${
    preloadOption([fixtureE])
  } ${
    fixtureG
  } ${fixtureF}`,
  function(err, stdout) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'smoosh\n');
  }
);
const stdinProc = childProcess.spawn(
  nodeBinary,
  ['--require', fixtureA],
  { stdio: 'pipe' }
);
stdinProc.stdin.end("console.log('hello');");
let stdinStdout = '';
stdinProc.stdout.on('data', function(d) {
  stdinStdout += d;
});
stdinProc.on('close', function(code) {
  assert.strictEqual(code, 0);
  assert.strictEqual(stdinStdout, 'A\nhello\n');
});
const replProc = childProcess.spawn(
  nodeBinary,
  ['-i', '--require', fixtureA],
  { stdio: 'pipe' }
);
replProc.stdin.end('.exit\n');
let replStdout = '';
replProc.stdout.on('data', (d) => {
  replStdout += d;
});
replProc.on('close', function(code) {
  assert.strictEqual(code, 0);
  const output = [
    'A',
    '> ',
  ];
  assert.ok(replStdout.startsWith(output[0]));
  assert.ok(replStdout.endsWith(output[1]));
});
childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureA])}-e "console.log('hello');" ${
    preloadOption([fixtureA, fixtureB])}`,
  function(err, stdout, stderr) {
    assert.ifError(err);
    assert.strictEqual(stdout, 'A\nB\nhello\n');
  }
);
const interactive = childProcess.exec(
  `"${nodeBinary}" ${preloadOption([fixtureD])}-i`,
  common.mustSucceed((stdout, stderr) => {
    assert.ok(stdout.endsWith("> 'test'\n> "));
  })
);
interactive.stdin.write('a\n');
interactive.stdin.write('process.exit()\n');
childProcess.exec(
  `"${nodeBinary}" --require "${fixtures.path('cluster-preload.js')}" "${
    fixtures.path('cluster-preload-test.js')}"`,
  function(err, stdout, stderr) {
    assert.ifError(err);
  }
);
childProcess.exec(
  { cwd: fixtures.fixturesDir },
  common.mustSucceed((stdout, stderr) => {
    assert.strictEqual(stdout, 'A\nB\n');
  })
);
if (common.isWindows) {
  childProcess.exec(
    `"${nodeBinary}" ${preloadOption(['.\\printA.js'])} "${fixtureB}"`,
    { cwd: fixtures.fixturesDir },
    common.mustSucceed((stdout, stderr) => {
      assert.strictEqual(stdout, 'A\nB\n');
    })
  );
}
childProcess.exec(
  `"${nodeBinary}" --require ` +
     `"${fixtures.path('cluster-preload.js')}" cluster-preload-test.js`,
  { cwd: fixtures.fixturesDir },
  function(err, stdout, stderr) {
    assert.ifError(err);
  }
);
