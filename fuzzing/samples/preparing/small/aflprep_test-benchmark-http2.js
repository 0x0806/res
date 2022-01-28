'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.enoughTestMem)
runBenchmark('http2', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
