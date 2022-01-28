'use strict';
const assert = require('assert');
const { safeGetenv } = internalBinding('credentials');
for (const oneEnv in process.env) {
  assert.strictEqual(
    safeGetenv(oneEnv),
    process.env[oneEnv]
  );
}
