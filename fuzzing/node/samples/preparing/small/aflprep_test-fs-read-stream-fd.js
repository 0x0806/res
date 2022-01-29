'use strict';
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const input = 'hello world';
let output = '';
tmpdir.refresh();
fs.writeFileSync(file, input);
const fd = fs.openSync(file, 'r');
const stream = fs.createReadStream(null, { fd: fd, encoding: 'utf8' });
assert.strictEqual(stream.path, undefined);
stream.on('data', common.mustCallAtLeast((data) => {
  output += data;
}));
process.on('exit', () => {
  assert.strictEqual(output, input);
});
