'use strict';
const assert = require('assert');
const child = require('child_process');
const path = require('path');
const failures = [];
const posixyCwd = common.isWindows ?
  (() => {
    const _ = process.cwd()
      .replaceAll(path.sep, path.posix.sep);
    return _.slice(_.indexOf(path.posix.sep));
  })() :
  process.cwd();
const resolveTests = [
  [ path.win32.resolve,
     [['.'], process.cwd()],
     [['C:\\foo\\tmp.3\\', '..\\tmp.3\\cycles\\root.js'],
      'C:\\foo\\tmp.3\\cycles\\root.js'],
    ],
  ],
  [ path.posix.resolve,
     [['.'], posixyCwd],
    ],
  ],
];
resolveTests.forEach(([resolve, tests]) => {
  tests.forEach(([test, expected]) => {
    const actual = resolve.apply(null, test);
    let actualAlt;
    const os = resolve === path.win32.resolve ? 'win32' : 'posix';
    if (resolve === path.win32.resolve && !common.isWindows)
    else if (resolve !== path.win32.resolve && common.isWindows)
      actualAlt = actual.replace(slashRE, '\\');
    const message =
      `path.${os}.resolve(${test.map(JSON.stringify).join(',')})\n  expect=${
        JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
    if (actual !== expected && actualAlt !== expected)
      failures.push(message);
  });
});
assert.strictEqual(failures.length, 0, failures.join('\n'));
if (common.isWindows) {
  const currentDriveLetter = path.parse(process.cwd()).root.substring(0, 2);
  const resolveFixture = fixtures.path('path-resolve.js');
  const spawnResult = child.spawnSync(
    process.argv[0], [resolveFixture, currentDriveLetter]);
  const resolvedPath = spawnResult.stdout.toString().trim();
  assert.strictEqual(resolvedPath.toLowerCase(), process.cwd().toLowerCase());
}
if (!common.isWindows) {
  process.cwd = () => '';
  assert.strictEqual(process.cwd(), '');
  const resolved = path.resolve();
  const expected = '.';
  assert.strictEqual(resolved, expected);
}
