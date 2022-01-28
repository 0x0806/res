'use strict';
const assert = require('assert');
const { UV_DIRENT_UNKNOWN } = internalBinding('constants').fs;
const fs = require('fs');
const path = require('path');
const filename = 'foo';
{
  tmpdir.refresh();
  fs.writeFileSync(path.join(tmpdir.path, filename), '');
}
{
  getDirents(
    tmpdir.path,
    [[filename], [UV_DIRENT_UNKNOWN]],
    common.mustCall((err, names) => {
      assert.strictEqual(err, null);
      assert.strictEqual(names.length, 1);
    },
    ));
}
{
  getDirents(
    tmpdir.path,
    [[Buffer.from(filename)], [UV_DIRENT_UNKNOWN]],
    common.mustCall((err, names) => {
      assert.strictEqual(err, null);
      assert.strictEqual(names.length, 1);
    },
    ));
}
{
  getDirents(
    Buffer.from(tmpdir.path),
    [[Buffer.from(filename)], [UV_DIRENT_UNKNOWN]],
    common.mustCall((err, names) => {
      assert.strictEqual(err, null);
      assert.strictEqual(names.length, 1);
    },
    ));
}
{
  getDirents(
    42,
    [[Buffer.from(filename)], [UV_DIRENT_UNKNOWN]],
    common.mustCall((err) => {
      assert.strictEqual(
        err.message,
        [
          'The "path" argument must be of type string or an ' +
          'instance of Buffer. Received type number (42)',
        ].join(''));
    },
    ));
}
{
  getDirent(
    tmpdir.path,
    filename,
    UV_DIRENT_UNKNOWN,
    common.mustCall((err, dirent) => {
      assert.strictEqual(err, null);
      assert.strictEqual(dirent.name, filename);
    },
    ));
}
{
  const filenameBuffer = Buffer.from(filename);
  getDirent(
    tmpdir.path,
    filenameBuffer,
    UV_DIRENT_UNKNOWN,
    common.mustCall((err, dirent) => {
      assert.strictEqual(err, null);
      assert.strictEqual(dirent.name, filenameBuffer);
    },
    ));
}
{
  const filenameBuffer = Buffer.from(filename);
  getDirent(
    Buffer.from(tmpdir.path),
    filenameBuffer,
    UV_DIRENT_UNKNOWN,
    common.mustCall((err, dirent) => {
      assert.strictEqual(err, null);
      assert.strictEqual(dirent.name, filenameBuffer);
    },
    ));
}
{
  getDirent(
    42,
    Buffer.from(filename),
    UV_DIRENT_UNKNOWN,
    common.mustCall((err) => {
      assert.strictEqual(
        err.message,
        [
          'The "path" argument must be of type string or an ' +
          'instance of Buffer. Received type number (42)',
        ].join(''));
    },
    ));
}
