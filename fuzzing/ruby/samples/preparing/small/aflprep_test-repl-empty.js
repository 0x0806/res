'use strict';
const assert = require('assert');
const repl = require('repl');
{
  let evalCalledWithExpectedArgs = false;
  const options = {
    eval: common.mustCall((cmd, context) => {
      evalCalledWithExpectedArgs = (cmd === '\n');
    })
  };
  const r = repl.start(options);
  try {
    r.write('\n');
  } finally {
    r.write('.exit\n');
  }
  assert(evalCalledWithExpectedArgs);
}
