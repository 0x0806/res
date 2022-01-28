'use strict';
const assert = require('assert');
const fs = require('fs');
const example = fixtures.path('x.txt');
fs.createReadStream(example, undefined);
fs.createReadStream(example, null);
fs.createReadStream(example, 'utf8');
fs.createReadStream(example, { encoding: 'utf8' });
const createReadStreamErr = (path, opt, error) => {
  assert.throws(() => {
    fs.createReadStream(path, opt);
  }, error);
};
const typeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
};
const rangeError = {
  code: 'ERR_OUT_OF_RANGE',
  name: 'RangeError'
};
[123, 0, true, false].forEach((opts) =>
  createReadStreamErr(example, opts, typeError)
);
[{}, { start: 0 }, { end: Infinity }].forEach((opts) =>
  fs.createReadStream(example, opts)
);
[
  { start: 'invalid' },
  { end: 'invalid' },
  { start: 'invalid', end: 'invalid' },
].forEach((opts) => createReadStreamErr(example, opts, typeError));
[{ start: NaN }, { end: NaN }, { start: NaN, end: NaN }].forEach((opts) =>
  createReadStreamErr(example, opts, rangeError)
);
[{ start: -1 }, { end: -1 }, { start: -1, end: -1 }].forEach((opts) =>
  createReadStreamErr(example, opts, rangeError)
);
[{ start: 0.1 }, { end: 0.1 }, { start: 0.1, end: 0.1 }].forEach((opts) =>
  createReadStreamErr(example, opts, rangeError)
);
fs.createReadStream(example, { start: 1, end: 5 });
createReadStreamErr(example, { start: 5, end: 1 }, rangeError);
const NOT_SAFE_INTEGER = 2 ** 53;
[
  { start: NOT_SAFE_INTEGER, end: Infinity },
  { start: 0, end: NOT_SAFE_INTEGER },
].forEach((opts) =>
  createReadStreamErr(example, opts, rangeError)
);
