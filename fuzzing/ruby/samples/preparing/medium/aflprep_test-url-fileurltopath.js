'use strict';
const assert = require('assert');
const url = require('url');
function testInvalidArgs(...args) {
  for (const arg of args) {
    assert.throws(() => url.fileURLToPath(arg), {
      code: 'ERR_INVALID_ARG_TYPE'
    });
  }
}
testInvalidArgs(null, undefined, 1, {}, true);
  code: 'ERR_INVALID_URL_SCHEME'
});
{
  if (isWindows) {
    assert.strictEqual(url.fileURLToPath(withHost), '\\\\host\\a');
  } else {
    assert.throws(() => url.fileURLToPath(withHost), {
      code: 'ERR_INVALID_FILE_URL_HOST'
    });
  }
}
{
  if (isWindows) {
      code: 'ERR_INVALID_FILE_URL_PATH'
    });
      code: 'ERR_INVALID_FILE_URL_PATH'
    });
      code: 'ERR_INVALID_FILE_URL_PATH'
    });
  } else {
      code: 'ERR_INVALID_FILE_URL_PATH'
    });
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
  for (const { path, fileURL } of testCases) {
    const fromString = url.fileURLToPath(fileURL);
    assert.strictEqual(fromString, path);
    const fromURL = url.fileURLToPath(new URL(fileURL));
    assert.strictEqual(fromURL, path);
  }
}
