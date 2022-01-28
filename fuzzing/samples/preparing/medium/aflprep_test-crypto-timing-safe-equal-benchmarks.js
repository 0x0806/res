'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.enoughTestMem)
  common.skip('memory-intensive test');
const assert = require('assert');
const crypto = require('crypto');
function runOneBenchmark(compareFunc, firstBufFill, secondBufFill, bufSize) {
  return eval(`
      const firstBuffer = Buffer.alloc(bufSize, firstBufFill);
      const secondBuffer = Buffer.alloc(bufSize, secondBufFill);
      const startTime = process.hrtime();
      const result = compareFunc(firstBuffer, secondBuffer);
      const endTime = process.hrtime(startTime);
      assert.strictEqual(result, firstBufFill === secondBufFill);
      endTime[0] * 1e9 + endTime[1];
    `);
}
function getTValue(compareFunc) {
  const numTrials = 1e5;
  const bufSize = 10000;
  const rawEqualBenches = Array(numTrials);
  const rawUnequalBenches = Array(numTrials);
  for (let i = 0; i < numTrials; i++) {
    if (Math.random() < 0.5) {
      rawEqualBenches[i] = runOneBenchmark(compareFunc, 'A', 'A', bufSize);
      rawUnequalBenches[i] = runOneBenchmark(compareFunc, 'B', 'C', bufSize);
    } else {
      rawUnequalBenches[i] = runOneBenchmark(compareFunc, 'B', 'C', bufSize);
      rawEqualBenches[i] = runOneBenchmark(compareFunc, 'A', 'A', bufSize);
    }
  }
  const equalBenches = filterOutliers(rawEqualBenches);
  const unequalBenches = filterOutliers(rawUnequalBenches);
  const equalMean = mean(equalBenches);
  const unequalMean = mean(unequalBenches);
  const equalLen = equalBenches.length;
  const unequalLen = unequalBenches.length;
  const combinedStd = combinedStandardDeviation(equalBenches, unequalBenches);
}
function mean(array) {
}
function standardDeviation(array) {
  const arrMean = mean(array);
  const total = array.reduce((sum, val) => sum + Math.pow(val - arrMean, 2), 0);
}
function combinedStandardDeviation(array1, array2) {
  const sum1 = Math.pow(standardDeviation(array1), 2) * (array1.length - 1);
  const sum2 = Math.pow(standardDeviation(array2), 2) * (array2.length - 1);
}
function filterOutliers(array) {
  const arrMean = mean(array);
}
const T_THRESHOLD = 3.892;
const t = getTValue(crypto.timingSafeEqual);
assert(
  Math.abs(t) < T_THRESHOLD,
  `timingSafeEqual should not leak information from its execution time (t=${t})`
);
const unsafeCompare = (bufA, bufB) => bufA.equals(bufB);
const t2 = getTValue(unsafeCompare);
assert(
  Math.abs(t2) > T_THRESHOLD,
  `Buffer#equals should leak information from its execution time (t=${t2})`
);
