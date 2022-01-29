'use strict';
const assert = require('assert');
const net = require('net');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
process.chdir(fixtures.fixturesDir);
const repl = require('repl');
{
  const server = net.createServer((conn) => {
    repl.start('', conn).on('exit', () => {
      conn.destroy();
      server.close();
    });
  });
  const host = common.localhostIPv4;
  const port = 0;
  const options = { host, port };
  let answer = '';
  server.listen(options, function() {
    options.port = this.address().port;
    const conn = net.connect(options);
    conn.setEncoding('utf8');
    conn.on('data', (data) => answer += data);
  });
  process.on('exit', function() {
    assert.strictEqual(answer, '\'eye catcher\'\n\'perhaps I work\'\n');
  });
}
{
  const server = net.createServer((conn) => {
    repl.start('', conn).on('exit', () => {
      conn.destroy();
      server.close();
    });
  });
  const host = common.localhostIPv4;
  const port = 0;
  const options = { host, port };
  let answer = '';
  server.listen(options, function() {
    options.port = this.address().port;
    const conn = net.connect(options);
    conn.setEncoding('utf8');
    conn.on('data', (data) => answer += data);
  });
  process.on('exit', function() {
  });
}
