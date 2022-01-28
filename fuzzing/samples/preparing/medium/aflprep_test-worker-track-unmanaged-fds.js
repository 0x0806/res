'use strict';
const assert = require('assert');
const { Worker, isMainThread } = require('worker_threads');
const { once } = require('events');
const fs = require('fs');
if (!isMainThread)
  common.skip('test needs to be able to freely set `trackUnmanagedFds`');
const preamble = `
const fs = require("fs");
const { parentPort } = require('worker_threads');
const __filename = ${JSON.stringify(__filename)};
process.on('warning', (warning) => parentPort.postMessage({ warning }));
`;
(async () => {
  {
    const w = new Worker(`${preamble}
    parentPort.postMessage(fs.openSync(__filename));
    `, { eval: true, trackUnmanagedFds: false });
    const [ [ fd ] ] = await Promise.all([once(w, 'message'), once(w, 'exit')]);
    assert(fd > 2);
    fs.closeSync(fd);
  }
  {
    const w = new Worker(`${preamble}
    parentPort.postMessage(fs.openSync(__filename));
    `, { eval: true, trackUnmanagedFds: true });
    const [ [ fd ] ] = await Promise.all([once(w, 'message'), once(w, 'exit')]);
    assert(fd > 2);
    assert.throws(() => fs.fstatSync(fd), { code: 'EBADF' });
  }
  {
    const w = new Worker(`${preamble}
    parentPort.postMessage(fs.openSync(__filename));
    `, { eval: true });
    const [ [ fd ] ] = await Promise.all([once(w, 'message'), once(w, 'exit')]);
    assert(fd > 2);
    assert.throws(() => fs.fstatSync(fd), { code: 'EBADF' });
  }
  {
    const w = new Worker(`${preamble}
    parentPort.postMessage(fs.openSync(__filename));
    parentPort.once('message', () => {
      const reopened = fs.openSync(__filename);
      fs.closeSync(reopened);
    });
    `, { eval: true, trackUnmanagedFds: true });
    const [ fd ] = await once(w, 'message');
    fs.closeSync(fd);
    w.postMessage('');
    const [ { warning } ] = await once(w, 'message');
    assert.match(warning.message,
  }
  {
    const w = new Worker(`${preamble}
    parentPort.once('message', (fd) => {
      fs.closeSync(fd);
    });
    `, { eval: true, trackUnmanagedFds: true });
    w.postMessage(fs.openSync(__filename));
    const [ { warning } ] = await once(w, 'message');
    assert.match(warning.message,
  }
})().then(common.mustCall());
