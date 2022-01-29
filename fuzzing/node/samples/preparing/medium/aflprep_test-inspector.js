'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
function checkListResponse(response) {
  const expectedLength = 1;
  assert.strictEqual(
    response.length,
    expectedLength,
    `Expected response length ${response.length} to be ${expectedLength}.`
  );
  assert.ok(response[0].devtoolsFrontendUrl);
  assert.ok(
      .test(response[0].webSocketDebuggerUrl),
    response[0].webSocketDebuggerUrl);
}
function checkVersion(response) {
  assert.ok(response);
  const expected = {
    'Protocol-Version': '1.1',
  };
  assert.strictEqual(JSON.stringify(response),
                     JSON.stringify(expected));
}
function checkBadPath(err) {
  assert(err instanceof SyntaxError);
}
function checkException(message) {
  assert.strictEqual(message.exceptionDetails, undefined);
}
function assertScopeValues({ result }, expected) {
  const unmatched = new Set(Object.keys(expected));
  for (const actual of result) {
    const value = expected[actual.name];
    if (value) {
      assert.strictEqual(
        actual.value.value,
        value,
        `Expected scope values to be ${actual.value.value} instead of ${value}.`
      );
      unmatched.delete(actual.name);
    }
  }
  if (unmatched.size)
    assert.fail(Array.from(unmatched.values()));
}
async function testBreakpointOnStart(session) {
  console.log('[test]',
              'Verifying debugger stops on start (--inspect-brk option)');
  const commands = [
    { 'method': 'Runtime.enable' },
    { 'method': 'Debugger.enable' },
    { 'method': 'Debugger.setPauseOnExceptions',
      'params': { 'state': 'none' } },
    { 'method': 'Debugger.setAsyncCallStackDepth',
      'params': { 'maxDepth': 0 } },
    { 'method': 'Profiler.enable' },
    { 'method': 'Profiler.setSamplingInterval',
      'params': { 'interval': 100 } },
    { 'method': 'Debugger.setBlackboxPatterns',
      'params': { 'patterns': [] } },
    { 'method': 'Runtime.runIfWaitingForDebugger' },
  ];
  await session.send(commands);
  await session.waitForBreakOnLine(0, session.scriptURL());
}
async function testBreakpoint(session) {
  console.log('[test]', 'Setting a breakpoint and verifying it is hit');
  const commands = [
    { 'method': 'Debugger.setBreakpointByUrl',
      'params': { 'lineNumber': 5,
                  'url': session.scriptURL(),
                  'columnNumber': 0,
                  'condition': '' } },
    { 'method': 'Debugger.resume' },
  ];
  await session.send(commands);
  const { scriptSource } = await session.send({
    'method': 'Debugger.getScriptSource',
    'params': { 'scriptId': session.mainScriptId },
  });
  assert(scriptSource && (scriptSource.includes(session.script())),
         `Script source is wrong: ${scriptSource}`);
  await session.waitForConsoleOutput('log', ['A message', 5]);
  const paused = await session.waitForBreakOnLine(5, session.scriptURL());
  const scopeId = paused.params.callFrames[0].scopeChain[0].object.objectId;
  console.log('[test]', 'Verify we can read current application state');
  const response = await session.send({
    'method': 'Runtime.getProperties',
    'params': {
      'objectId': scopeId,
      'ownProperties': false,
      'accessorPropertiesOnly': false,
      'generatePreview': true
    }
  });
  assertScopeValues(response, { t: 1001, k: 1 });
  let { result } = await session.send({
    'method': 'Debugger.evaluateOnCallFrame', 'params': {
      'callFrameId': session.pausedDetails().callFrames[0].callFrameId,
      'expression': 'k + t',
      'objectGroup': 'console',
      'includeCommandLineAPI': true,
      'silent': false,
      'returnByValue': false,
      'generatePreview': true
    }
  });
  const expectedEvaluation = 1002;
  assert.strictEqual(
    result.value,
    expectedEvaluation,
    `Expected evaluation to be ${expectedEvaluation}, got ${result.value}.`
  );
  result = (await session.send({
    'method': 'Runtime.evaluate', 'params': {
      'expression': '5 * 5'
    }
  })).result;
  const expectedResult = 25;
  assert.strictEqual(
    result.value,
    expectedResult,
    `Expected Runtime.evaluate to be ${expectedResult}, got ${result.value}.`
  );
}
async function testI18NCharacters(session) {
  console.log('[test]', 'Verify sending and receiving UTF8 characters');
  const chars = 'טֶ字и';
  session.send({
    'method': 'Debugger.evaluateOnCallFrame', 'params': {
      'callFrameId': session.pausedDetails().callFrames[0].callFrameId,
      'expression': `console.log("${chars}")`,
      'objectGroup': 'console',
      'includeCommandLineAPI': true,
      'silent': false,
      'returnByValue': false,
      'generatePreview': true
    }
  });
  await session.waitForConsoleOutput('log', [chars]);
}
async function testCommandLineAPI(session) {
  const testModuleStr = JSON.stringify(testModulePath);
  const printAModuleStr = JSON.stringify(printAModulePath);
  const printBModuleStr = JSON.stringify(printBModulePath);
  let result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': 'typeof require("fs").readFile === "function"',
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.strictEqual(result.result.value, true);
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': [
          'typeof require.resolve === "function"',
          'typeof require.extensions === "object"',
          'typeof require.cache === "object"',
        ].join(' && '),
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.strictEqual(result.result.value, true);
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `
          Object.assign(
            require(${testModuleStr}),
            { old: 'yes' }
          ) === require(${testModuleStr})`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.strictEqual(result.result.value, true);
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `JSON.stringify(
          require.cache[${testModuleStr}].exports
        )`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.deepStrictEqual(JSON.parse(result.result.value),
                         { old: 'yes' });
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `delete require.cache[${testModuleStr}]`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.strictEqual(result.result.value, true);
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `JSON.stringify(require(${testModuleStr}))`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.deepStrictEqual(JSON.parse(result.result.value), {});
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `JSON.stringify(require(${printAModuleStr}))`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.deepStrictEqual(JSON.parse(result.result.value), {});
  result = await session.send(
    {
      'method': 'Runtime.evaluate', 'params': {
        'expression': `JSON.stringify({
          parentsEqual:
            require.cache[${testModuleStr}].parent ===
            require.cache[${printAModuleStr}].parent,
          parentId: require.cache[${testModuleStr}].parent.id,
        })`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.deepStrictEqual(JSON.parse(result.result.value), {
    parentsEqual: true,
    parentId: '<inspector console>'
  });
  result = await session.send(
    {
      'method': 'Debugger.evaluateOnCallFrame', 'params': {
        'callFrameId': session.pausedDetails().callFrames[0].callFrameId,
        'expression': `(
          require(${printBModuleStr}),
          require.cache[${printBModuleStr}].parent.id
        )`,
        'includeCommandLineAPI': true
      }
    });
  checkException(result);
  assert.notStrictEqual(result.result.value,
                        '<inspector console>');
}
async function runTest() {
  const child = new NodeInstance();
  const session = await child.connectInspectorSession();
  await testBreakpointOnStart(session);
  await testBreakpoint(session);
  await testI18NCharacters(session);
  await testCommandLineAPI(session);
  await session.runToCompletion();
  const expectedExitCode = 55;
  const { exitCode } = await child.expectShutdown();
  assert.strictEqual(
    exitCode,
    expectedExitCode,
    `Expected exit code to be ${expectedExitCode} but got ${expectedExitCode}.`
  );
}
runTest().then(common.mustCall());
