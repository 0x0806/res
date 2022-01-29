'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const dummyPayload = Buffer.alloc(10000, 'yolo');
let runs = 0;
let gced = 0;
function ongc() { gced++; }
connect();
function connect() {
  if (runs % 64 === 0)
    global.gc();
  const externalMemoryUsage = process.memoryUsage().external;
  assert(externalMemoryUsage >= 0, `${externalMemoryUsage} < 0`);
  if (runs++ === 512) {
    assert(gced >= 256, `${gced} < 256`);
    return;
  }
  const { clientSide, serverSide } = makeDuplexPair();
  const tlsSocket = tls.connect({ socket: clientSide });
  tlsSocket.on('error', common.mustCall(connect));
  onGC(tlsSocket, { ongc });
  setImmediate(() => serverSide.write(dummyPayload));
}
