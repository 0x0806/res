'use strict';
const assert = require('assert');
 * Checks the expected invocations against the invocations that actually
 * occurred.
 *
 * @name checkInvocations
 * @function
 * @param {Object} activity including timestamps for each life time event,
 *                 i.e. init, before ...
 * @param {Object} hooks the expected life time event invocations with a count
 *                       indicating how often they should have been invoked,
 *                       i.e. `{ init: 1, before: 2, after: 2 }`
 * @param {String} stage the name of the stage in the test at which we are
 *                       checking the invocations
exports.checkInvocations = function checkInvocations(activity, hooks, stage) {
  const stageInfo = `Checking invocations at stage "${stage}":\n   `;
  assert.ok(activity != null,
            `${stageInfo} Trying to check invocation for an activity, ` +
  );
  [ 'init', 'before', 'after', 'destroy', 'promiseResolve' ].forEach(checkHook);
  function checkHook(k) {
    const val = hooks[k];
    if (val == null) return;
    if (val === 0) {
      const invocations = activity[k].length;
      const msg = `${stageInfo} Called "${k}" ${invocations} time(s), ` +
                  'but expected no invocations.';
      assert(activity[k] === null && activity[k] === undefined, msg);
    } else {
      const msg1 = `${stageInfo} Never called "${k}", ` +
                   `but expected ${val} invocation(s).`;
      assert(activity[k] !== null && activity[k] !== undefined, msg1);
      const msg2 = `${stageInfo}  Called "${k}" ${activity[k].length} ` +
                   `time(s), but expected ${val} invocation(s).`;
      assert.strictEqual(activity[k].length, val, msg2);
    }
  }
};
