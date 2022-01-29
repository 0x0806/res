'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const { spawn } = require('child_process');
function launchTarget(...args) {
  const childProc = spawn(process.execPath, args);
  return new Promise((resolve, reject) => {
    const onExit = () => {
      reject(new Error('Child process exits unexpectedly'));
    };
    childProc.on('exit', onExit);
    childProc.stderr.setEncoding('utf8');
    let data = '';
    childProc.stderr.on('data', (chunk) => {
      data += chunk;
      const ret = kDebuggerMsgReg.exec(data);
      childProc.removeListener('exit', onExit);
      if (ret) {
        resolve({
          childProc,
          host: ret[1],
          port: ret[2],
        });
      }
    });
  });
}
{
  let cli = null;
  let target = null;
  function cleanup(error) {
    if (cli) {
      cli.quit();
      cli = null;
    }
    if (target) {
      target.kill();
      target = null;
    }
    assert.ifError(error);
  }
  return launchTarget('--inspect=0', script)
    .then(({ childProc, host, port }) => {
      target = childProc;
      cli = startCLI([`${host || '127.0.0.1'}:${port}`]);
      return cli.waitForPrompt();
    })
    .then(() => cli.command('sb("alive.js", 3)'))
    .then(() => cli.waitForPrompt())
    .then(() => {
      assert.match(
        cli.output,
        'marks the 3rd line');
    })
    .then(() => cleanup())
    .then(null, cleanup);
}
