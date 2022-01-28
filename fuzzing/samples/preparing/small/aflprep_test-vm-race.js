'use strict';
const vm = require('vm');
const sandbox = { timeout: 5 };
const context = vm.createContext(sandbox);
const script = new vm.Script(
  'var d = Date.now() + timeout;while (d > Date.now());'
);
const immediate = setImmediate(function() {
  throw new Error('Detected vm race condition!');
});
const giveUp = Date.now() + 5000;
do {
  try {
    script.runInContext(context, { timeout: 5 });
    ++sandbox.timeout;
  } catch {
    --sandbox.timeout;
  }
} while (Date.now() < giveUp);
clearImmediate(immediate);
