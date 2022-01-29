'use strict';
const assert = require('assert');
const fs = require('fs');
tmpdir.refresh();
{
  fs.writeFileSync(filename, '0123456789');
  assert.strictEqual(fs.readFileSync(filename).toString(), '0123456789');
  fs.truncateSync(filename, 5);
  assert.strictEqual(fs.readFileSync(filename).toString(), '01234');
}
{
  fs.writeFileSync(filename, '0123456789');
  assert.strictEqual(fs.readFileSync(filename).toString(), '0123456789');
  fs.truncate(
    filename,
    5,
    common.mustSucceed(() => {
      assert.strictEqual(fs.readFileSync(filename).toString(), '01234');
    })
  );
}
