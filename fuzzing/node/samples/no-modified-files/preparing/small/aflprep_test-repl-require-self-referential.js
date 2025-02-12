'use strict';
const assert = require('assert');
const { spawn } = require('child_process');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
const selfRefModule = fixtures.path('self_ref_module');
const child = spawn(process.execPath,
                    ['--interactive'],
                    { cwd: selfRefModule }
);
let output = '';
child.stdout.on('data', (chunk) => output += chunk);
child.on('exit', common.mustCall(() => {
  assert.deepStrictEqual(results, [ "'Self resolution working'", '' ]);
}));
child.stdin.write('require("self_ref");\n');
child.stdin.write('.exit');
child.stdin.end();
