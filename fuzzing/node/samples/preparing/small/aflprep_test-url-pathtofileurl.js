'use strict';
const assert = require('assert');
const url = require('url');
{
}
{
  const fileURL = url.pathToFileURL('test\\').href;
  if (isWindows)
  else
    assert.ok(fileURL.endsWith('%5C'));
}
{
  assert.ok(fileURL.includes('%25'));
}
{
  if (isWindows) {
    assert.throws(() => url.pathToFileURL('\\\\\\no-server'), {
      code: 'ERR_INVALID_ARG_VALUE'
    });
    assert.throws(() => url.pathToFileURL('\\\\host'), {
      code: 'ERR_INVALID_ARG_VALUE'
    });
  } else {
    const fileURL = url.pathToFileURL('\\\\nas\\share\\path.txt').href;
  }
}
{
  let testCases;
  if (isWindows) {
    testCases = [
    ];
  } else {
    testCases = [
    ];
  }
  for (const { path, expected } of testCases) {
    const actual = url.pathToFileURL(path).href;
    assert.strictEqual(actual, expected);
  }
}
