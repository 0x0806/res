'use strict';
const assert = require('assert');
const { findSourceMap, SourceMap } = require('module');
const { readFileSync } = require('fs');
{
  [1, true, 'foo'].forEach((invalidArg) =>
    assert.throws(
      () => new SourceMap(invalidArg),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
        message: 'The "payload" argument must be of type object.' +
               common.invalidArgTypeHelper(invalidArg)
      }
    )
  );
}
{
  const sourceMap = findSourceMap(
  );
  const {
    originalLine,
    originalColumn,
    originalSource
  } = sourceMap.findEntry(0, 29);
  assert.strictEqual(originalLine, 2);
  assert.strictEqual(originalColumn, 4);
  assert(originalSource.endsWith('disk.js'));
}
{
  let callSite;
  let sourceMap;
  Error.prepareStackTrace = (error, trace) => {
    const throwingRequireCallSite = trace[0];
    if (throwingRequireCallSite.getFileName().endsWith('typescript-throw.js')) {
      sourceMap = findSourceMap(throwingRequireCallSite.getFileName());
      callSite = throwingRequireCallSite;
    }
  };
  try {
  } catch (err) {
  }
  assert(callSite);
  assert(sourceMap);
  const {
    generatedLine,
    generatedColumn,
    originalLine,
    originalColumn,
    originalSource
  } = sourceMap.findEntry(
    callSite.getLineNumber() - 1,
    callSite.getColumnNumber() - 1
  );
  assert.strictEqual(generatedLine, 19);
  assert.strictEqual(generatedColumn, 14);
  assert.strictEqual(originalLine, 17);
  assert.strictEqual(originalColumn, 10);
  assert(originalSource.endsWith('typescript-throw.ts'));
}
{
  const payload = JSON.parse(readFileSync(
  ));
  const sourceMap = new SourceMap(payload);
  const {
    originalLine,
    originalColumn,
    originalSource
  } = sourceMap.findEntry(0, 29);
  assert.strictEqual(originalLine, 2);
  assert.strictEqual(originalColumn, 4);
  assert(originalSource.endsWith('disk.js'));
  assert.strictEqual(payload.mappings, sourceMap.payload.mappings);
  assert.notStrictEqual(payload, sourceMap.payload);
  assert.strictEqual(payload.sources[0], sourceMap.payload.sources[0]);
  assert.notStrictEqual(payload.sources, sourceMap.payload.sources);
}
{
  function makeMinimalMap(column) {
    return {
      sources: ['test.js'],
      mappings: `AAA${column}`,
    };
  }
  const knownDecodings = {
    'A': 0,
    'B': -2147483648,
    'C': 1,
    'D': -1,
    'E': 2,
    'F': -2,
  };
  for (const column in knownDecodings) {
    const sourceMap = new SourceMap(makeMinimalMap(column));
    const { originalColumn } = sourceMap.findEntry(0, 0);
    assert.strictEqual(originalColumn, knownDecodings[column]);
  }
}
{
  function makeMinimalMap(generatedColumns, originalColumns) {
    return {
      sources: ['test.js'],
      mappings: generatedColumns.map((g, i) => `${g}AA${originalColumns[i]}`)
        .join(',')
    };
  }
  const sourceMap = new SourceMap(makeMinimalMap(
    ['U', 'F', 'F'],
    ['A', 'E', 'E']
  ));
  assert.strictEqual(sourceMap.findEntry(0, 6).originalColumn, 4);
  assert.strictEqual(sourceMap.findEntry(0, 8).originalColumn, 2);
  assert.strictEqual(sourceMap.findEntry(0, 10).originalColumn, 0);
}
