'use strict';
if (!common.hasIntl)
  common.skip('missing Intl');
const assert = require('assert');
const url = require('url');
assert.strictEqual(
  url.format(myURL),
);
assert.strictEqual(
  url.format(myURL, {}),
);
{
  [true, 1, 'test', Infinity].forEach((value) => {
    assert.throws(
      () => url.format(myURL, value),
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
        message: 'The "options" argument must be of type object.' +
                 common.invalidArgTypeHelper(value)
      }
    );
  });
}
assert.strictEqual(
  url.format(myURL, { fragment: false }),
);
assert.strictEqual(
  url.format(myURL, { fragment: '' }),
);
assert.strictEqual(
  url.format(myURL, { fragment: 0 }),
);
assert.strictEqual(
  url.format(myURL, { fragment: 1 }),
);
assert.strictEqual(
  url.format(myURL, { fragment: {} }),
);
assert.strictEqual(
  url.format(myURL, { search: false }),
);
assert.strictEqual(
  url.format(myURL, { search: '' }),
);
assert.strictEqual(
  url.format(myURL, { search: 0 }),
);
assert.strictEqual(
  url.format(myURL, { search: 1 }),
);
assert.strictEqual(
  url.format(myURL, { search: {} }),
);
assert.strictEqual(
  url.format(myURL, { unicode: true }),
);
assert.strictEqual(
  url.format(myURL, { unicode: 1 }),
);
assert.strictEqual(
  url.format(myURL, { unicode: {} }),
);
assert.strictEqual(
  url.format(myURL, { unicode: false }),
);
assert.strictEqual(
  url.format(myURL, { unicode: 0 }),
);
assert.strictEqual(
);
