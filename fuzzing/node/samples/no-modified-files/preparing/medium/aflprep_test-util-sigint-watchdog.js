'use strict';
if (common.isWindows) {
  common.skip('platform not supported');
}
const assert = require('assert');
const binding = internalBinding('contextify');
[(next) => {
  binding.startSigintWatchdog();
  const hadPendingSignals = binding.stopSigintWatchdog();
  assert.strictEqual(hadPendingSignals, false);
  next();
},
 (next) => {
   binding.startSigintWatchdog();
   process.kill(process.pid, 'SIGINT');
   waitForPendingSignal(common.mustCall(() => {
     const hadPendingSignals = binding.stopSigintWatchdog();
     assert.strictEqual(hadPendingSignals, true);
     next();
   }));
 },
 (next) => {
   binding.startSigintWatchdog();
   binding.startSigintWatchdog();
   process.kill(process.pid, 'SIGINT');
   waitForPendingSignal(common.mustCall(() => {
     const hadPendingSignals1 = binding.stopSigintWatchdog();
     const hadPendingSignals2 = binding.stopSigintWatchdog();
     assert.strictEqual(hadPendingSignals1, true);
     assert.strictEqual(hadPendingSignals2, false);
     next();
   }));
 },
 () => {
   binding.startSigintWatchdog();
   binding.startSigintWatchdog();
   const hadPendingSignals1 = binding.stopSigintWatchdog();
   process.kill(process.pid, 'SIGINT');
   waitForPendingSignal(common.mustCall(() => {
     const hadPendingSignals2 = binding.stopSigintWatchdog();
     assert.strictEqual(hadPendingSignals1, false);
     assert.strictEqual(hadPendingSignals2, true);
   }));
 }].reduceRight((a, b) => common.mustCall(b).bind(null, a))();
function waitForPendingSignal(cb) {
  if (binding.watchdogHasPendingSigint())
    cb();
  else
    setTimeout(waitForPendingSignal, 10, cb);
}
