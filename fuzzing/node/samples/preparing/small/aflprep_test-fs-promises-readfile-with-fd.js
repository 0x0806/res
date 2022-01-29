'use strict';
const assert = require('assert');
const path = require('path');
const { writeFileSync } = require('fs');
const { open } = require('fs').promises;
tmpdir.refresh();
const fn = path.join(tmpdir.path, 'test.txt');
writeFileSync(fn, 'Hello World');
async function readFileTest() {
  const handle = await open(fn, 'r');
  const buf = Buffer.alloc(5);
  const { bytesRead } = await handle.read(buf, 0, 5, null);
  assert.strictEqual(bytesRead, 5);
  assert.deepStrictEqual(buf.toString(), 'Hello');
  assert.deepStrictEqual((await handle.readFile()).toString(), ' World');
  await handle.close();
}
readFileTest()
  .then(common.mustCall());
