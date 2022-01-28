'use strict';
if (!common.enoughTestMem)
  common.skip('Insufficient memory for HTTP benchmark test');
runBenchmark('http', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
