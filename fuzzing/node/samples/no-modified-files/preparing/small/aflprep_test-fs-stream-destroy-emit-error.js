'use strict';
const assert = require('assert');
const fs = require('fs');
tmpdir.refresh();
{
  const stream = fs.createReadStream(__filename);
  stream.on('close', common.mustCall());
  test(stream);
}
{
  stream.on('close', common.mustCall());
  test(stream);
}
{
  const stream = fs.createReadStream(__filename, { emitClose: true });
  stream.on('close', common.mustCall());
  test(stream);
}
{
                                      { emitClose: true });
  stream.on('close', common.mustCall());
  test(stream);
}
function test(stream) {
  const err = new Error('DESTROYED');
  stream.on('open', function() {
    stream.destroy(err);
  });
  stream.on('error', common.mustCall(function(err_) {
    assert.strictEqual(err_, err);
  }));
}
