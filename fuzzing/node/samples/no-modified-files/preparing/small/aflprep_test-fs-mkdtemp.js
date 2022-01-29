'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const tmpFolder = fs.mkdtempSync(path.join(tmpdir.path, 'foo.'));
assert.strictEqual(path.basename(tmpFolder).length, 'foo.XXXXXX'.length);
assert(fs.existsSync(tmpFolder));
const utf8 = fs.mkdtempSync(path.join(tmpdir.path, '\u0222abc.'));
assert.strictEqual(Buffer.byteLength(path.basename(utf8)),
                   Buffer.byteLength('\u0222abc.XXXXXX'));
assert(fs.existsSync(utf8));
function handler(err, folder) {
  assert.ifError(err);
  assert(fs.existsSync(folder));
  assert.strictEqual(this, undefined);
}
fs.mkdtemp(path.join(tmpdir.path, 'bar.'), common.mustCall(handler));
fs.mkdtemp(path.join(tmpdir.path, 'bar.'), {}, common.mustCall(handler));
const warningMsg = 'mkdtemp() templates ending with X are not portable. ' +
common.expectWarning('Warning', warningMsg);
fs.mkdtemp(path.join(tmpdir.path, 'bar.X'), common.mustCall(handler));
