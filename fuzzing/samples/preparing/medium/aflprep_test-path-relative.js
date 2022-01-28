'use strict';
const assert = require('assert');
const path = require('path');
const failures = [];
const relativeTests = [
  [ path.win32.relative,
     ['C:\\foo\\bar\\baz\\quux', 'C:\\', '..\\..\\..\\..'],
     ['C:\\foo\\test', 'C:\\foo\\test\\bar\\package.json', 'bar\\package.json'],
     ['C:\\foo\\bar\\baz-quux', 'C:\\foo\\bar\\baz', '..\\baz'],
     ['C:\\foo\\bar\\baz', 'C:\\foo\\bar\\baz-quux', '..\\baz-quux'],
     ['\\\\foo\\bar', '\\\\foo\\bar\\baz', 'baz'],
     ['\\\\foo\\bar\\baz', '\\\\foo\\bar', '..'],
     ['\\\\foo\\bar\\baz-quux', '\\\\foo\\bar\\baz', '..\\baz'],
     ['\\\\foo\\bar\\baz', '\\\\foo\\bar\\baz-quux', '..\\baz-quux'],
     ['C:\\baz-quux', 'C:\\baz', '..\\baz'],
     ['C:\\baz', 'C:\\baz-quux', '..\\baz-quux'],
     ['\\\\foo\\baz-quux', '\\\\foo\\baz', '..\\baz'],
     ['\\\\foo\\baz', '\\\\foo\\baz-quux', '..\\baz-quux'],
     ['C:\\baz', '\\\\foo\\bar\\baz', '\\\\foo\\bar\\baz'],
     ['\\\\foo\\bar\\baz', 'C:\\baz', 'C:\\baz'],
    ],
  ],
  [ path.posix.relative,
    ],
  ],
];
relativeTests.forEach((test) => {
  const relative = test[0];
  test[1].forEach((test) => {
    const actual = relative(test[0], test[1]);
    const expected = test[2];
    if (actual !== expected) {
      const os = relative === path.win32.relative ? 'win32' : 'posix';
      const message = `path.${os}.relative(${
        test.slice(0, 2).map(JSON.stringify).join(',')})\n  expect=${
        JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
      failures.push(`\n${message}`);
    }
  });
});
assert.strictEqual(failures.length, 0, failures.join(''));
