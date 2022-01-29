'use strict';
const assert = require('assert');
const path = require('path');
                   'fixtures\\b\\c.js');
                   '\\\\server\\share\\dir\\file.ext');
assert.strictEqual(path.win32.normalize('C:'), 'C:.');
assert.strictEqual(path.win32.normalize('C:..\\abc'), 'C:..\\abc');
assert.strictEqual(path.win32.normalize('C:..\\..\\abc\\..\\def'),
                   'C:..\\..\\def');
assert.strictEqual(path.win32.normalize('C:\\.'), 'C:\\');
assert.strictEqual(path.win32.normalize('file:stream'), 'file:stream');
assert.strictEqual(path.win32.normalize('bar\\foo..\\..\\'), 'bar\\');
assert.strictEqual(path.win32.normalize('bar\\foo..\\..'), 'bar');
assert.strictEqual(path.win32.normalize('bar\\foo..\\..\\baz'), 'bar\\baz');
assert.strictEqual(path.win32.normalize('bar\\foo..\\'), 'bar\\foo..\\');
assert.strictEqual(path.win32.normalize('bar\\foo..'), 'bar\\foo..');
assert.strictEqual(path.win32.normalize('..\\foo..\\..\\..\\bar'),
                   '..\\..\\bar');
assert.strictEqual(path.win32.normalize('..\\...\\..\\.\\...\\..\\..\\bar'),
                   '..\\..\\bar');
                   '..\\..\\..\\..\\..\\bar');
                   '..\\..\\..\\..\\..\\..\\');
assert.strictEqual(
  '..\\..\\'
);
assert.strictEqual(
  '..\\..\\..\\..\\baz'
);
assert.strictEqual(
);
assert.strictEqual(
);
