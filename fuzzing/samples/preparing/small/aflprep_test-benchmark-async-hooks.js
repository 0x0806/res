'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.enoughTestMem)
  common.skip('Insufficient memory for async_hooks benchmark test');
runBenchmark('async_hooks');
