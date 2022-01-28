'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const command = common.isWindows ? 'cd' : 'pwd';
const options = { cwd: tmpdir.path };
tmpdir.refresh();
if (common.isWindows) {
  options.shell = true;
}
const testCases = [
  undefined,
  null,
  [],
];
const expectedResult = tmpdir.path.trim().toLowerCase();
const results = testCases.map((testCase) => {
  const { stdout, stderr, error } = spawnSync(
    command,
    testCase,
    options
  );
  assert.ifError(error);
  assert.deepStrictEqual(stderr, Buffer.alloc(0));
  return stdout.toString().trim().toLowerCase();
});
assert.deepStrictEqual([...new Set(results)], [expectedResult]);
