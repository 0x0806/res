'use strict';
const {
  assertSummaryShape,
  expectExperimentalWarning
const vm = require('vm');
expectExperimentalWarning();
{
  vm.measureMemory()
    .then(common.mustCall(assertSummaryShape));
  global.gc();
}
{
  vm.measureMemory({})
    .then(common.mustCall(assertSummaryShape));
  global.gc();
}
{
  vm.measureMemory({ mode: 'summary' })
    .then(common.mustCall(assertSummaryShape));
  global.gc();
}
{
  vm.measureMemory({ mode: 'detailed' })
    .then(common.mustCall(assertSummaryShape));
  global.gc();
}
