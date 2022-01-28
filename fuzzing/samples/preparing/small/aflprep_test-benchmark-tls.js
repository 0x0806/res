'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.enoughTestMem)
  common.skip('Insufficient memory for TLS benchmark test');
runBenchmark('tls', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
