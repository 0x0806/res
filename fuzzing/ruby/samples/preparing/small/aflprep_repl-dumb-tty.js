'use strict';
process.env.TERM = 'dumb';
const repl = require('repl');
repl.start('> ');
process.stdin.push('le.log("foo")\n');
process.stdin.push('\n');
process.stdin.push('"str"\n');
process.stdin.push('console.dir({ a: 1 })\n');
process.stdin.push('{ a: 1 }\n');
process.stdin.push('\n');
process.stdin.push('.exit\n');
{
  const stream = new ArrayStream();
  const replServer = new repl.REPLServer({
    prompt: '> ',
    terminal: true,
    input: stream,
    output: process.stdout,
    useColors: false
  });
  replServer.on('close', common.mustCall());
  replServer.write(null, { ctrl: true, name: 'r' });
  replServer.write(null, { ctrl: true, name: 's' });
  replServer.write(null, { ctrl: true, name: 'd' });
}
