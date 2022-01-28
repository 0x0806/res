'use strict';
const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const { debuglog, getSystemErrorName } = require('util');
const debug = debuglog('test');
const TIMER = 200;
const SLEEP = common.platformTimeout(5000);
switch (process.argv[2]) {
  case 'child':
    setTimeout(() => {
      debug('child fired');
      process.exit(1);
    }, SLEEP);
    break;
  default:
    const start = Date.now();
    const ret = spawnSync(process.execPath, [__filename, 'child'],
                          { timeout: TIMER });
    assert.strictEqual(ret.error.code, 'ETIMEDOUT');
    assert.strictEqual(getSystemErrorName(ret.error.errno), 'ETIMEDOUT');
    const end = Date.now() - start;
    assert(end < SLEEP);
    assert(ret.status > 128 || ret.signal);
    break;
}
