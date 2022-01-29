'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (common.hasFipsCrypto)
  common.skip('some benchmarks are FIPS-incompatible');
runBenchmark('crypto', { NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
