'use strict';
if (!common.enoughTestMem)
  common.skip('Insufficient memory for Worker benchmark test');
runBenchmark('worker', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
