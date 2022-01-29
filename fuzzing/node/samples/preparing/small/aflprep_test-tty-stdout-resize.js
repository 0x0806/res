'use strict';
const { notStrictEqual } = require('assert');
process.stdout.columns = 9001;
process.stdout.on('resize', mustCall());
process.kill(process.pid, 'SIGWINCH');
setImmediate(mustCall(() => notStrictEqual(process.stdout.columns, 9001)));
