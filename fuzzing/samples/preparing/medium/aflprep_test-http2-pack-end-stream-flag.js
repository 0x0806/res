'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { PerformanceObserver } = require('perf_hooks');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  stream.respond({
    ':status': 200
  });
  switch (headers[':path']) {
      stream.end('OK');
      break;
      stream.write('OK');
      stream.end();
      break;
      stream.write('OK', () => stream.end());
      break;
  }
});
function testRequest(path, targetFrameCount, callback) {
  const obs = new PerformanceObserver(
    common.mustCallAtLeast((list, observer) => {
      const entries = list.getEntries();
      for (let n = 0; n < entries.length; n++) {
        const entry = entries[n];
        if (entry.name !== 'Http2Session') continue;
        if (entry.detail.type !== 'client') continue;
        assert.strictEqual(entry.detail.framesReceived, targetFrameCount);
        observer.disconnect();
        callback();
      }
    }));
  obs.observe({ type: 'http2' });
  const client =
      const req = client.request({ ':path': path });
      req.resume();
      req.end();
      req.on('end', () => client.close());
    });
}
const MIN_FRAME_COUNT = 4;
server.listen(0, () => {
        server.close();
      });
    });
  });
});
