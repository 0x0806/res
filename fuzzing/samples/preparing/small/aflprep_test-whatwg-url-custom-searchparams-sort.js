'use strict';
const tests = [{ input: '', output: [] }];
const pairs = [];
for (let i = 10; i < 100; i++) {
  pairs.push([`a${i}`, 'b']);
  tests[0].output.push([`a${i}`, 'b']);
}
tests[0].input = pairs.sort(() => Math.random() > 0.5)
  .map((pair) => pair.join('=')).join('&');
tests.push(
  {
    'input': 'z=a&=b&c=d',
    'output': [['', 'b'], ['c', 'd'], ['z', 'a']]
  }
);
tests.forEach((val) => {
  test(() => {
    const params = new URLSearchParams(val.input);
    let i = 0;
    params.sort();
    for (const param of params) {
      assert_array_equals(param, val.output[i]);
      i++;
    }
  }, `Parse and sort: ${val.input}`);
  test(() => {
    url.searchParams.sort();
    const params = new URLSearchParams(url.search);
    let i = 0;
    for (const param of params) {
      assert_array_equals(param, val.output[i]);
      i++;
    }
  }, `URL parse and sort: ${val.input}`);
});
