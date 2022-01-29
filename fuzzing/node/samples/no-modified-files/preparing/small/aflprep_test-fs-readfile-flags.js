'use strict';
const fs = require('fs');
const assert = require('assert');
const path = require('path');
tmpdir.refresh();
{
  const emptyFile = path.join(tmpdir.path, 'empty.txt');
  fs.closeSync(fs.openSync(emptyFile, 'w'));
  fs.readFile(
    emptyFile,
    { encoding: 'utf8', flag: 'a+' },
    common.mustCall((err, data) => { assert.strictEqual(data, ''); })
  );
  fs.readFile(
    emptyFile,
    { encoding: 'utf8', flag: 'ax+' },
    common.mustCall((err, data) => { assert.strictEqual(err.code, 'EEXIST'); })
  );
}
{
  const willBeCreated = path.join(tmpdir.path, 'will-be-created');
  fs.readFile(
    willBeCreated,
    { encoding: 'utf8', flag: 'a+' },
    common.mustCall((err, data) => { assert.strictEqual(data, ''); })
  );
}
{
  const willNotBeCreated = path.join(tmpdir.path, 'will-not-be-created');
  fs.readFile(
    willNotBeCreated,
    { encoding: 'utf8' },
    common.mustCall((err, data) => { assert.strictEqual(err.code, 'ENOENT'); })
  );
}
