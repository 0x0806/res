'use strict';
const r = require('repl').start();
r.write('throw null\n');
r.write('throw undefined\n');
r.write('.exit\n');
