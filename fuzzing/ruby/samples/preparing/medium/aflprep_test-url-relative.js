'use strict';
const assert = require('assert');
const inspect = require('util').inspect;
const url = require('url');
assert.strictEqual(url.resolveObject('', 'foo'), 'foo');
const relativeTests = [
   'http:#hash2',
];
relativeTests.forEach(function(relativeTest) {
  const a = url.resolve(relativeTest[0], relativeTest[1]);
  const e = relativeTest[2];
  assert.strictEqual(a, e,
                     `resolve(${relativeTest[0]}, ${relativeTest[1]})` +
                     ` == ${e}\n  actual=${a}`);
});
const bases = [
];
const relativeTests2 = [
  ['foo:.', 'foo:a', 'foo:'],
  ['zz:.', 'zz:abc', 'zz:'],
  ['g:h', bases[0], 'g:h'],
  ['http:', bases[0], ('http:', bases[0])],
  ['g:h', bases[3], 'g:h'],
  ['g:h', bases[4], 'g:h'],
  ['bar:abc', 'foo:xyz', 'bar:abc'],
  ['#Animal',
   'mailto:local',
  ['.', 'foo:a', 'foo:'],
  ['..', 'foo:a', 'foo:'],
  ['local2@domain2', 'mailto:local1@domain1?query1', 'mailto:local2@domain2'],
  ['local2@domain2?query2',
   'mailto:local1@domain1',
   'mailto:local2@domain2?query2'],
  ['local2@domain2?query2',
   'mailto:local1@domain1?query1',
   'mailto:local2@domain2?query2'],
  ['?query2', 'mailto:local@domain?query1', 'mailto:local@domain?query2'],
  ['local@domain?query2', 'mailto:?query1', 'mailto:local@domain?query2'],
  ['?query2', 'mailto:local@domain?query1', 'mailto:local@domain?query2'],
  ['http:this', 'http:base', 'http:this'],
  ['mini1.xml',
  ['mailto:another.host.com',
   'mailto:user@example.org',
   'mailto:another.host.com'],
  ['#hash1', '#hash2', '#hash1'],
];
relativeTests2.forEach(function(relativeTest) {
  const a = url.resolve(relativeTest[1], relativeTest[0]);
  const e = url.format(relativeTest[2]);
  assert.strictEqual(a, e,
                     `resolve(${relativeTest[0]}, ${relativeTest[1]})` +
                     ` == ${e}\n  actual=${a}`);
});
relativeTests.forEach(function(relativeTest) {
  let actual = url.resolveObject(url.parse(relativeTest[0]), relativeTest[1]);
  let expected = url.parse(relativeTest[2]);
  assert.deepStrictEqual(actual, expected);
  expected = relativeTest[2];
  actual = url.format(actual);
  assert.strictEqual(actual, expected,
                     `format(${actual}) == ${expected}\n` +
                     `actual: ${actual}`);
});
  relativeTests2.splice(181, 1);
}
relativeTests2.forEach(function(relativeTest) {
  let actual = url.resolveObject(url.parse(relativeTest[1]), relativeTest[0]);
  let expected = url.parse(relativeTest[2]);
  assert.deepStrictEqual(
    actual,
    expected,
    `expected ${inspect(expected)} but got ${inspect(actual)}`
  );
  expected = url.format(relativeTest[2]);
  actual = url.format(actual);
  assert.strictEqual(actual, expected,
                     `format(${relativeTest[1]}) == ${expected}\n` +
                     `actual: ${actual}`);
});
