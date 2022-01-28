'use strict';
const assert = require('assert');
const path = require('path');
const failures = [];
const joinTests = [
  [ [path.posix.join, path.win32.join],
     [[], '.'],
     [['.', '.', '.'], '.'],
     [['.'], '.'],
     [['', '.'], '.'],
     [['', 'foo'], 'foo'],
     [['', '', 'foo'], 'foo'],
     [['foo', ''], 'foo'],
     [[''], '.'],
     [['', ''], '.'],
     [[' ', '.'], ' '],
     [[' ', ''], ' '],
    ],
  ],
];
joinTests.push([
  path.win32.join,
  joinTests[0][1].slice(0).concat(
      [['c:'], 'c:.'],
      [['c:.'], 'c:.'],
      [['c:', ''], 'c:.'],
      [['', 'c:'], 'c:.'],
      [['c:.', 'file'], 'c:file'],
      [['c:', 'file'], 'c:\\file'],
    ]
  ),
]);
joinTests.forEach((test) => {
  if (!Array.isArray(test[0]))
    test[0] = [test[0]];
  test[0].forEach((join) => {
    test[1].forEach((test) => {
      const actual = join.apply(null, test[0]);
      const expected = test[1];
      let actualAlt;
      let os;
      if (join === path.win32.join) {
        os = 'win32';
      } else {
        os = 'posix';
      }
      if (actual !== expected && actualAlt !== expected) {
        const delimiter = test[0].map(JSON.stringify).join(',');
        const message = `path.${os}.join(${delimiter})\n  expect=${
          JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
        failures.push(`\n${message}`);
      }
    });
  });
});
assert.strictEqual(failures.length, 0, failures.join(''));
