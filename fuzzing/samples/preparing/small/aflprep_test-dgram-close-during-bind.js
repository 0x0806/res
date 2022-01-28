'use strict';
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const { handle } = socket[kStateSymbol];
const lookup = handle.lookup;
handle.bind = common.mustNotCall('bind() should not be called.');
handle.lookup = common.mustCall(function(address, callback) {
  socket.close(common.mustCall(() => {
    lookup.call(this, address, callback);
  }));
});
socket.bind(common.mustNotCall('Socket should not bind.'));
