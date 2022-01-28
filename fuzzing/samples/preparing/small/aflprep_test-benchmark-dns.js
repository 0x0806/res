'use strict';
runBenchmark('dns', { ...process.env, NODEJS_BENCHMARK_ZERO_ALLOWED: 1 });
