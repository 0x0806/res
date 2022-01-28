'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { spawnSync } = require('child_process');
const bindingPath = path.resolve(
  __dirname, '..', 'addons', 'uv-handle-leak', 'build',
if (!fs.existsSync(bindingPath))
  common.skip('binding not built yet');
if (process.argv[2] === 'child') {
  const { Worker } = require('worker_threads');
  require(bindingPath);
  new Worker(`
  const binding = require(${JSON.stringify(bindingPath)});
  binding.leakHandle();
  binding.leakHandle(0);
  binding.leakHandle(0x42);
  `, { eval: true });
} else {
  const child = cp.spawnSync(process.execPath, [__filename, 'child']);
  const stderr = child.stderr.toString();
  assert.strictEqual(child.stdout.toString(), '');
  const lines = stderr.split('\n');
  let state = 'initial';
  function isGlibc() {
    try {
      const lddOut = spawnSync('ldd', [process.execPath]).stdout;
      const libcInfo = lddOut.toString().split('\n').map(
      if (libcInfo.length === 0)
        return false;
      const nmOut = spawnSync('nm', ['-D', libcInfo[0][1]]).stdout;
        return true;
    } catch {
      return false;
    }
  }
  if (!(common.isFreeBSD ||
        common.isAIX ||
        (common.isLinux && !isGlibc()) ||
        common.isWindows)) {
    assert(stderr.includes('ExampleOwnerClass'), stderr);
    assert(stderr.includes('CloseCallback'), stderr);
    assert(stderr.includes('example_instance'), stderr);
  }
  while (lines.length > 0) {
    const line = lines.shift().trim();
    switch (state) {
      case 'initial':
        state = 'handle-start';
        break;
      case 'handle-start':
          state = 'assertion-failure';
          break;
        }
        state = 'close-callback';
        break;
      case 'close-callback':
        state = 'data';
        break;
      case 'data':
        state = 'maybe-first-field';
        break;
      case 'maybe-first-field':
          lines.unshift(line);
        }
        state = 'handle-start';
        break;
      case 'assertion-failure':
        state = 'done';
        break;
      case 'done':
        break;
    }
  }
  assert.strictEqual(state, 'done');
}
