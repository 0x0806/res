'use strict';
const net = require('net');
let counter1 = 0;
let counter2 = 0;
function Test1() {
  const server = net.createServer().listen(0);
  const timer1 = setInterval(common.mustCall(() => {
    timer1.unref();
    if (counter1++ === 3) {
      clearInterval(timer1);
      server.close(() => {
        Test2();
      });
    }
  }, 4), 1);
}
function Test2() {
  const server = net.createServer().listen(0);
  const timer2 = setInterval(() => {
    timer2.unref();
    if (counter2++ === 3)
      server.close();
  }, 1);
}
Test1();
