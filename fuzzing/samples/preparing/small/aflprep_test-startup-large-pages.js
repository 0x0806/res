'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
{
  const child = spawnSync(process.execPath,
                          [ '--use-largepages=on', '-p', '42' ],
                          { stdio: ['inherit', 'pipe', 'inherit'] });
  assert.strictEqual(child.status, 0);
  assert.strictEqual(child.signal, null);
  assert.strictEqual(stdout.length, 1);
  assert.strictEqual(stdout[0], '42');
}
{
  const child = spawnSync(process.execPath,
                          [ '--use-largepages=xyzzy', '-p', '42' ]);
  assert.strictEqual(child.status, 9);
  assert.strictEqual(child.signal, null);
                     'invalid value for --use-largepages');
}
