'use strict';
const repl = require('repl');
const input = new ArrayStream();
repl.start({ input, output: process.stdout, useGlobal: true });
input.run(['let process']);
