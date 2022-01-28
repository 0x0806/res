'use strict';
const assert = require('assert');
fs.assertEncoding();
fs.assertEncoding('utf8');
assert.throws(
  () => fs.assertEncoding('foo'),
  { code: 'ERR_INVALID_ARG_VALUE', name: 'TypeError' }
);
{
  const pathString = 'c:\\test1';
  const linkPathString = '\\test2';
  const preprocessSymlinkDestination = fs.preprocessSymlinkDestination(
    pathString,
    'junction',
    linkPathString
  );
  if (process.platform === 'win32') {
  } else {
    assert.strictEqual(preprocessSymlinkDestination, pathString);
  }
}
{
  const pathString = 'c:\\test1';
  const linkPathString = '\\test2';
  const preprocessSymlinkDestination = fs.preprocessSymlinkDestination(
    pathString,
    undefined,
    linkPathString
  );
  if (process.platform === 'win32') {
    assert.strictEqual(
  } else {
    assert.strictEqual(preprocessSymlinkDestination, pathString);
  }
}
