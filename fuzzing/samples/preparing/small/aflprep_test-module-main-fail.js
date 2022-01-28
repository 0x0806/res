'use strict';
const assert = require('assert');
const { execFileSync } = require('child_process');
const entryPoints = ['iDoNotExist', 'iDoNotExist.js', 'iDoNotExist.mjs'];
const node = process.argv[0];
for (const entryPoint of entryPoints) {
  try {
    execFileSync(node, [entryPoint], { stdio: 'pipe' });
  } catch (e) {
    continue;
  }
  assert.fail('Executing node with inexistent entry point should ' +
              `fail. Entry point: ${entryPoint}`);
}
