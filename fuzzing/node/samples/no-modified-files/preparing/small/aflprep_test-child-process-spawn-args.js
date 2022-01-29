'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
tmpdir.refresh();
const command = common.isWindows ? 'cd' : 'pwd';
const options = { cwd: tmpdir.path };
if (common.isWindows) {
  options.shell = true;
}
const testCases = [
  undefined,
  null,
  [],
];
const expectedResult = tmpdir.path.trim().toLowerCase();
(async () => {
  const results = await Promise.all(
    testCases.map((testCase) => {
      return new Promise((resolve) => {
        const subprocess = spawn(command, testCase, options);
        let accumulatedData = Buffer.alloc(0);
        subprocess.stdout.on('data', common.mustCall((data) => {
          accumulatedData = Buffer.concat([accumulatedData, data]);
        }));
        subprocess.stdout.on('end', () => {
          resolve(accumulatedData.toString().trim().toLowerCase());
        });
      });
    })
  );
  assert.deepStrictEqual([...new Set(results)], [expectedResult]);
})().then(common.mustCall());
