'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
{
  const state = recordState();
}
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile(process.execPath);
});
server.listen(0, () => {
  const req = client.request();
  req.on('response', common.mustCall(() => {
    const state = recordState();
      {
        children: [
          { node_name: 'Http2Stream', edge_name: 'wrapped' },
        ]
      },
    ], { loose: true });
      {
        children: [
          { node_name: 'FileHandle', edge_name: 'wrapped' },
        ]
      },
    ], { loose: true });
      {
        children: [
          { node_name: 'TCP', edge_name: 'wrapped' },
        ]
      },
    ], { loose: true });
      {
        children: [
          { node_name: 'TCP', edge_name: 'wrapped' },
        ]
      },
    ], { loose: true });
      {
        children: [
          { node_name: 'StreamPipe', edge_name: 'wrapped' },
        ]
      },
    ]);
      {
        children: [
          { node_name: 'Http2Session', edge_name: 'wrapped' },
          {
          },
        ]
      },
    ], { loose: true });
  }));
  req.resume();
  req.on('end', common.mustCall(() => {
    client.close();
    server.close();
  }));
  req.end();
});
