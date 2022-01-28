'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
async function testHttp(child, number) {
  try {
    return true;
  } catch (e) {
    console.error(`Attempt ${number} failed`, e);
    return false;
  }
}
async function runTest() {
  const child = new NodeInstance(undefined, '');
  const promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(testHttp(child, i));
  }
  const result = await Promise.all(promises);
  assert(!result.some((a) => !a), 'Some attempts failed');
  return child.kill();
}
runTest().then(common.mustCall());
