'use strict';
if (common.isAIX)
  common.skip('folder watch capability is limited in AIX.');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const fn = '新建文夹件.txt';
const a = path.join(tmpdir.path, fn);
const watchers = new Set();
function registerWatcher(watcher) {
  watchers.add(watcher);
}
function unregisterWatcher(watcher) {
  watcher.close();
  watchers.delete(watcher);
  if (watchers.size === 0) {
    clearInterval(interval);
  }
}
{
  const watcher = fs.watch(
    tmpdir.path,
    { encoding: 'hex' },
    (event, filename) => {
      if (['e696b0e5bbbae69687e5a4b9e4bbb62e747874', null].includes(filename))
        done(watcher);
    }
  );
  registerWatcher(watcher);
}
{
  const watcher = fs.watch(
    tmpdir.path,
    (event, filename) => {
      if ([fn, null].includes(filename))
        done(watcher);
    }
  );
  registerWatcher(watcher);
}
{
  const watcher = fs.watch(
    tmpdir.path,
    { encoding: 'buffer' },
    (event, filename) => {
      if (filename instanceof Buffer && filename.toString('utf8') === fn)
        done(watcher);
      else if (filename === null)
        done(watcher);
    }
  );
  registerWatcher(watcher);
}
const done = common.mustCall(unregisterWatcher, watchers.size);
const interval = setInterval(() => {
  const fd = fs.openSync(a, 'w+');
  fs.closeSync(fd);
  fs.unlinkSync(a);
}, common.platformTimeout(100));
