'use strict';
const net = require('net');
const data = Buffer.alloc(1000000).toString('hex');
const server = net.createServer(common.mustCall(function(conn) {
  conn.resume();
})).listen(0, common.mustCall(function() {
  const conn = net.createConnection(this.address().port, common.mustCall(() => {
    let count = 0;
    function writeLoop() {
      if (count++ === 20) {
        conn.destroy();
        server.close();
        return;
      }
      while (conn.write(data, 'hex'));
      global.gc(true);
    }
    conn.on('drain', writeLoop);
    writeLoop();
  }));
}));
