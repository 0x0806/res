'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
{
  const file = path.join(tmpdir.path, 'write-end-test0.txt');
  const stream = fs.createWriteStream(file);
  stream.end();
  stream.on('close', common.mustCall());
}
{
  const file = path.join(tmpdir.path, 'write-end-test1.txt');
  const stream = fs.createWriteStream(file);
  stream.end('a\n', 'utf8');
  stream.on('close', common.mustCall(function() {
    const content = fs.readFileSync(file, 'utf8');
    assert.strictEqual(content, 'a\n');
  }));
}
{
  const file = path.join(tmpdir.path, 'write-end-test2.txt');
  const stream = fs.createWriteStream(file);
  stream.end();
  let calledOpen = false;
  stream.on('open', () => {
    calledOpen = true;
  });
  stream.on('finish', common.mustCall(() => {
    assert.strictEqual(calledOpen, true);
  }));
}
