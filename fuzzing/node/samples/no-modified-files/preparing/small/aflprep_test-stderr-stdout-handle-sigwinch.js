'use strict';
const originalRefreshSizeStderr = process.stderr._refreshSize;
const originalRefreshSizeStdout = process.stdout._refreshSize;
const wrap = (fn, ioStream, string) => {
  const wrapped = common.mustCall(() => {
    console.log(string);
    try {
      fn.call(ioStream);
    } catch (e) {
      if (!common.isSunOS || e.code !== 'EINVAL')
        throw e;
    }
  });
  return wrapped;
};
process.stderr._refreshSize = wrap(originalRefreshSizeStderr,
                                   process.stderr,
                                   'calling stderr._refreshSize');
process.stdout._refreshSize = wrap(originalRefreshSizeStdout,
                                   process.stdout,
                                   'calling stdout._refreshSize');
setTimeout(function() {
  process.emit('SIGWINCH');
}, common.isAIX ? 200 : 0);
