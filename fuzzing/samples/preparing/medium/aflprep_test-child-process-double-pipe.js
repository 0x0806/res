'use strict';
const {
  isWindows,
  mustCall,
  mustCallAtLeast,
const assert = require('assert');
const os = require('os');
const spawn = require('child_process').spawn;
const debug = require('util').debuglog('test');
let grep, sed, echo;
if (isWindows) {
  grep = spawn('grep', ['--binary', 'o']);
  echo = spawn('cmd.exe',
                'node&&', 'echo', 'and&&', 'echo', 'world']);
} else {
  grep = spawn('grep', ['o']);
  echo = spawn('echo', ['hello\nnode\nand\nworld\n']);
}
echo.stdout.on('data', mustCallAtLeast((data) => {
  debug(`grep stdin write ${data.length}`);
  if (!grep.stdin.write(data)) {
    echo.stdout.pause();
  }
}));
grep.stdin.on('drain', (data) => {
  echo.stdout.resume();
});
echo.stdout.on('end', mustCall((code) => {
  grep.stdin.end();
}));
echo.on('exit', mustCall(() => {
  debug('echo exit');
}));
grep.on('exit', mustCall(() => {
  debug('grep exit');
}));
sed.on('exit', mustCall(() => {
  debug('sed exit');
}));
grep.stdout.on('data', mustCallAtLeast((data) => {
  debug(`grep stdout ${data.length}`);
  if (!sed.stdin.write(data)) {
    grep.stdout.pause();
  }
}));
sed.stdin.on('drain', (data) => {
  grep.stdout.resume();
});
grep.stdout.on('end', mustCall((code) => {
  debug('grep stdout end');
  sed.stdin.end();
}));
let result = '';
sed.stdout.on('data', mustCallAtLeast((data) => {
  result += data.toString('utf8', 0, data.length);
  debug(data);
}));
sed.stdout.on('end', mustCall((code) => {
  assert.strictEqual(result, `hellO${os.EOL}nOde${os.EOL}wOrld${os.EOL}`);
}));
