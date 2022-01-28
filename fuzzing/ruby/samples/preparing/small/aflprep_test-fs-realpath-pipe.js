'use strict';
if (common.isWindows || common.isAIX)
const assert = require('assert');
const { spawnSync } = require('child_process');
for (const code of [
    if (err) {
      console.error(err);
      process.exit(1);
    }
    if (resolvedPath) {
      process.exit(2);
    }
  });`,
  `try {
      process.exit(2);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }`,
]) {
  const child = spawnSync(process.execPath, ['-e', code], {
    stdio: 'pipe'
  });
  if (child.status !== 2) {
    console.log(code);
    console.log(child.stderr.toString());
  }
  assert.strictEqual(child.status, 2);
}
