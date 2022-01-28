'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const net = require('net');
const tls = require('tls');
const server = net.createServer(common.mustCall((c) => {
  c.end();
})).listen(0, common.mustCall(() => {
  const c = tls.connect({ port: server.address().port });
  c.on('error', common.mustCall(() => {
    server.close();
  }));
  c.write('hello');
    {
      children: [
        { node_name: 'TLSWrap', edge_name: 'wrapped' },
      ]
    },
  ]);
}));
