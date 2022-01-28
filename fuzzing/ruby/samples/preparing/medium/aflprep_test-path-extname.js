'use strict';
const assert = require('assert');
const path = require('path');
const failures = [];
[
  [__filename, '.js'],
  ['', ''],
  ['file', ''],
  ['file.ext', '.ext'],
  ['.file', ''],
  ['.file.ext', '.ext'],
  ['file.ext.ext', '.ext'],
  ['file.', '.'],
  ['.', ''],
  ['.file.ext', '.ext'],
  ['.file', ''],
  ['.file.', '.'],
  ['.file..', '.'],
  ['..', ''],
  ['..file.ext', '.ext'],
  ['..file', '.file'],
  ['..file.', '.'],
  ['..file..', '.'],
  ['...', '.'],
  ['...ext', '.ext'],
  ['....', '.'],
].forEach((test) => {
  const expected = test[1];
  [path.posix.extname, path.win32.extname].forEach((extname) => {
    let input = test[0];
    let os;
    if (extname === path.win32.extname) {
      input = input.replace(slashRE, '\\');
      os = 'win32';
    } else {
      os = 'posix';
    }
    const actual = extname(input);
    const message = `path.${os}.extname(${JSON.stringify(input)})\n  expect=${
      JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
    if (actual !== expected)
      failures.push(`\n${message}`);
  });
  {
    const input = `C:${test[0].replace(slashRE, '\\')}`;
    const actual = path.win32.extname(input);
    const message = `path.win32.extname(${JSON.stringify(input)})\n  expect=${
      JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
    if (actual !== expected)
      failures.push(`\n${message}`);
  }
});
assert.strictEqual(failures.length, 0, failures.join(''));
assert.strictEqual(path.win32.extname('.\\'), '');
assert.strictEqual(path.win32.extname('..\\'), '');
assert.strictEqual(path.win32.extname('file.ext\\'), '.ext');
assert.strictEqual(path.win32.extname('file.ext\\\\'), '.ext');
assert.strictEqual(path.win32.extname('file\\'), '');
assert.strictEqual(path.win32.extname('file\\\\'), '');
assert.strictEqual(path.win32.extname('file.\\'), '.');
assert.strictEqual(path.win32.extname('file.\\\\'), '.');
assert.strictEqual(path.posix.extname('.\\'), '');
assert.strictEqual(path.posix.extname('..\\'), '.\\');
assert.strictEqual(path.posix.extname('file.ext\\'), '.ext\\');
assert.strictEqual(path.posix.extname('file.ext\\\\'), '.ext\\\\');
assert.strictEqual(path.posix.extname('file\\'), '');
assert.strictEqual(path.posix.extname('file\\\\'), '');
assert.strictEqual(path.posix.extname('file.\\'), '.\\');
assert.strictEqual(path.posix.extname('file.\\\\'), '.\\\\');
