'use strict';
const { Worker } = require('worker_threads');
const assert = require('assert');
  .on('error', common.mustNotCall(() => {}));
  .on('error', common.mustNotCall(() => {}));
  .on('error', common.mustCall(() => {}));
  .on('error', common.mustCall(() => {}));
  .on('error', common.mustNotCall(() => {}));
  .on('error', common.mustCall(() => {}));
  .on(
    'exit',
    common.mustCall((exitCode) => { assert.strictEqual(exitCode, 13); })
  );
