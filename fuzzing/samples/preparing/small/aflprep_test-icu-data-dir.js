'use strict';
const os = require('os');
const { hasSmallICU } = internalBinding('config');
if (!(common.hasIntl && hasSmallICU))
  common.skip('missing Intl');
const assert = require('assert');
const { spawnSync } = require('child_process');
const expected =
    'could not initialize ICU (check NODE_ICU_DATA or ' +
    `--icu-data-dir parameters)${os.EOL}`;
{
  assert(child.stderr.toString().includes(expected));
}
{
  const child = spawnSync(process.execPath, ['-e', '0'], { env });
  assert(child.stderr.toString().includes(expected));
}
