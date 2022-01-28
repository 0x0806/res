'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { spawnSync } = require('child_process');
tmpdir.refresh();
if (process.config.variables.node_shared)
  common.skip("can't test Linux perf with shared libraries yet");
if (!common.isLinux)
  common.skip('only testing Linux for now');
const frequency = 99;
const repeat = 5;
const sampleCount = 10;
const perfFlags = [
  'record',
  `-F${frequency}`,
  '-g',
];
const nodeCommonFlags = [
  '--perf-basic-prof',
  '--interpreted-frames-native-stack',
];
const perfInterpretedFramesArgs = [
  ...perfFlags,
  '--',
  process.execPath,
  ...nodeCommonFlags,
  '--no-opt',
  fixtures.path('linux-perf.js'),
  `${sleepTime}`,
  `${repeat}`,
];
const perfCompiledFramesArgs = [
  ...perfFlags,
  '--',
  process.execPath,
  ...nodeCommonFlags,
  '--always-opt',
  fixtures.path('linux-perf.js'),
  `${sleepTime}`,
  `${repeat}`,
];
const perfArgsList = [
  perfInterpretedFramesArgs, perfCompiledFramesArgs,
];
const perfScriptArgs = [
  'script',
];
const options = {
  cwd: tmpdir.path,
  encoding: 'utf-8',
};
let output = '';
for (const perfArgs of perfArgsList) {
  const perf = spawnSync('perf', perfArgs, options);
  assert.ifError(perf.error);
  if (perf.status !== 0)
    throw new Error(`Failed to execute 'perf': ${perf.stderr}`);
  const perfScript = spawnSync('perf', perfScriptArgs, options);
  assert.ifError(perfScript.error);
  if (perfScript.status !== 0)
    throw new Error(`Failed to execute perf script: ${perfScript.stderr}`);
  output += perfScript.stdout;
}
function makeAssertMessage(message) {
  return message + '\nPerf output:\n\n' + output;
}
assert.ok(output.match(interpretedFunctionOneRe),
          makeAssertMessage("Couldn't find interpreted functionOne()"));
assert.ok(output.match(compiledFunctionOneRe),
          makeAssertMessage("Couldn't find compiled functionOne()"));
assert.ok(output.match(interpretedFunctionTwoRe),
          makeAssertMessage("Couldn't find interpreted functionTwo()"));
assert.ok(output.match(compiledFunctionTwoRe),
          makeAssertMessage("Couldn't find compiled functionTwo"));
