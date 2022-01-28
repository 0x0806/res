'use strict';
const assert = require('assert');
const path = require('path');
const { readFileSync } = require('fs');
const { open } = require('fs').promises;
tmpdir.refresh();
const fn = path.join(tmpdir.path, 'test.txt');
async function writeFileTest() {
  const handle = await open(fn, 'w');
  const buf = Buffer.from('Hello');
  const { bytesWritten } = await handle.write(buf, 0, 5, null);
  assert.strictEqual(bytesWritten, 5);
  await handle.writeFile('World');
  assert.deepStrictEqual(readFileSync(fn).toString(), 'HelloWorld');
  await handle.close();
}
writeFileTest()
  .then(common.mustCall());
