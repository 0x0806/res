'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const { TLSSocket } = require('tls');
let { clientSide } = makeDuplexPair();
let clientTLS = new TLSSocket(clientSide, { isServer: false });
setImmediate(() => {
  clientTLS = null;
  global.gc();
  clientTLSHandle = null;
  global.gc();
  setImmediate(() => {
    clientSide = null;
    global.gc();
  });
});
