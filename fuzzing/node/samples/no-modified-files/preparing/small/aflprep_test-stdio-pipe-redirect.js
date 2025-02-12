'use strict';
if (!common.isMainThread)
  common.skip("Workers don't have process-like stdio");
const spawn = require('child_process').spawn;
const writeSize = 100;
const totalDots = 10000;
const who = process.argv.length <= 2 ? 'parent' : process.argv[2];
switch (who) {
  case 'parent':
    const consumer = spawn(process.argv0, [process.argv[1], 'consumer'], {
      stdio: ['pipe', 'ignore', 'inherit'],
    });
    const producer = spawn(process.argv0, [process.argv[1], 'producer'], {
      stdio: ['pipe', consumer.stdin, 'inherit'],
    });
    process.stdin.on('data', () => {});
    producer.on('exit', process.exit);
    break;
  case 'producer':
    const buffer = Buffer.alloc(writeSize, '.');
    let written = 0;
    const write = () => {
      if (written < totalDots) {
        written += writeSize;
        process.stdout.write(buffer, write);
      }
    };
    write();
    break;
  case 'consumer':
    process.stdin.on('data', () => {});
    break;
}
