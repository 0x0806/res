'use strict';
const assert = require('assert');
const net = require('net');
const { fork, spawn } = require('child_process');
const subScript = fixtures.path('child-process-persistent.js');
{
  const n = fork(subScript);
  const rv = n.send({ h: 'w' }, assert.ifError);
  assert.strictEqual(rv, true);
  n.kill('SIGKILL');
}
{
  const spawnOptions = { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] };
  const s = spawn(process.execPath, [subScript], spawnOptions);
  const server = net.createServer(common.mustNotCall()).listen(0, () => {
    const handle = server._handle;
    const rv1 = s.send('one', handle, (err) => { if (err) assert.fail(err); });
    assert.strictEqual(rv1, true);
    const rv2 = s.send('two', (err) => { if (err) assert.fail(err); });
    assert.strictEqual(rv2, true);
    const rv3 = s.send('three', (err) => { if (err) assert.fail(err); });
    assert.strictEqual(rv3, false);
    const rv4 = s.send('four', (err) => {
      if (err) assert.fail(err);
      const rv5 = s.send('5', handle, (err) => { if (err) assert.fail(err); });
      assert.strictEqual(rv5, true);
      s.kill();
      handle.close();
      server.close();
    });
    assert.strictEqual(rv4, false);
  });
}
