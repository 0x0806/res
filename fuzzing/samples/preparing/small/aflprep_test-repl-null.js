'use strict';
const repl = require('repl');
const replserver = new repl.REPLServer();
replserver._inTemplateLiteral = true;
replserver.emit('line', null);
replserver.emit('line', '.exit');
