'use strict';
const assert = require('assert');
const repl = require('repl');
{
  let evalCalledWithExpectedArgs = false;
  const options = {
    eval: common.mustCall((cmd, context) => {
      evalCalledWithExpectedArgs = (cmd === 'function f() {}\n' &&
                                    context.foo === 'bar');
    })
  };
  const r = repl.start(options);
  r.context = { foo: 'bar' };
  try {
    r.write('function f() {}\n');
  } finally {
    r.write('.exit\n');
  }
  assert(evalCalledWithExpectedArgs);
}
