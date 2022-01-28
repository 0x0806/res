'use strict';
if (common.isWindows)
  common.skip('dgram clustering is currently not supported on Windows.');
const cluster = require('cluster');
const dgram = require('dgram');
const kPort = 0;
function child() {
  const kTime = 2;
  const countdown = new Countdown(kTime * 2, () => {
    process.exit(0);
  });
  for (let i = 0; i < kTime; i += 1) {
    const socket = new dgram.Socket('udp4');
    socket.bind(kPort, common.mustCall(() => {
      process.nextTick(() => {
        socket.close(countdown.dec());
        const socket2 = new dgram.Socket('udp4');
        socket2.bind(kPort, common.mustCall(() => {
          process.nextTick(() => {
            socket2.close(countdown.dec());
          });
        }));
      });
    }));
  }
}
if (cluster.isMaster)
  cluster.fork(__filename);
else
  child();
