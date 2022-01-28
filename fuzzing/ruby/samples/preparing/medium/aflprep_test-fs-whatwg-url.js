'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const os = require('os');
function pathToFileURL(p) {
  if (!path.isAbsolute(p))
    throw new Error('Path must be absolute');
  if (common.isWindows && p.startsWith('\\\\'))
    p = p.slice(2);
}
const p = path.resolve(fixtures.fixturesDir, 'a.js');
const url = pathToFileURL(p);
assert(url instanceof URL);
fs.readFile(url, common.mustSucceed((data) => {
  assert(Buffer.isBuffer(data));
}));
assert.throws(
  () => {
    fs.readFile(httpUrl, common.mustNotCall());
  },
  {
    code: 'ERR_INVALID_URL_SCHEME',
    name: 'TypeError',
    message: 'The URL must be of scheme file'
  });
if (common.isWindows) {
  ['%2f', '%2F', '%5c', '%5C'].forEach((i) => {
    assert.throws(
      () => {
      },
      {
        code: 'ERR_INVALID_FILE_URL_PATH',
        name: 'TypeError',
      }
    );
  });
  assert.throws(
    () => {
    },
    {
      code: 'ERR_INVALID_ARG_VALUE',
      name: 'TypeError',
      message: 'The argument \'path\' must be a string or Uint8Array without ' +
               "null bytes. Received 'c:\\\\tmp\\\\\\x00test'"
    }
  );
} else {
  ['%2f', '%2F'].forEach((i) => {
    assert.throws(
      () => {
      },
      {
        code: 'ERR_INVALID_FILE_URL_PATH',
        name: 'TypeError',
      });
  });
  assert.throws(
    () => {
    },
    {
      code: 'ERR_INVALID_FILE_URL_HOST',
      name: 'TypeError',
      message: `File URL host must be "localhost" or empty on ${os.platform()}`
    }
  );
  assert.throws(
    () => {
    },
    {
      code: 'ERR_INVALID_ARG_VALUE',
      name: 'TypeError',
      message: "The argument 'path' must be a string or Uint8Array without " +
    }
  );
}
