'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const filename = path.join(tmpdir.path, 'write.txt');
tmpdir.refresh();
{
  const parameters = [Buffer.from('bár'), 0, Buffer.byteLength('bár')];
  while (parameters.length > 0) {
    const fd = fs.openSync(filename, 'w');
    let written = fs.writeSync(fd, '');
    assert.strictEqual(written, 0);
    fs.writeSync(fd, 'foo');
    written = fs.writeSync(fd, ...parameters);
    assert.ok(written > 3);
    fs.closeSync(fd);
    assert.strictEqual(fs.readFileSync(filename, 'utf-8'), 'foobár');
    parameters.pop();
  }
}
