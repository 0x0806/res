'use strict';
const {
  mustCall,
  mustNotCall,
  hasCrypto,
  platformTimeout,
  skip
if (!hasCrypto)
  skip('missing crypto');
const { strictEqual } = require('assert');
const {
  createServer,
  connect,
  constants: {
    HTTP2_HEADER_STATUS,
    HTTP_STATUS_OK
  }
} = require('http2');
{
  const server = createServer(mustCall((request, response) => {
    response.end('end', 'utf8', mustCall(() => {
      response.end(mustCall());
      process.nextTick(() => {
        response.end(mustCall());
        server.close();
      });
    }));
    response.on('finish', mustCall(() => {
      response.end(mustCall());
    }));
    response.end(mustCall());
  }));
  server.listen(0, mustCall(() => {
    let data = '';
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.setEncoding('utf8');
      request.on('data', (chunk) => (data += chunk));
      request.on('end', mustCall(() => {
        strictEqual(data, 'end');
        client.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    strictEqual(response, response.end());
    strictEqual(response, response.end());
    server.close();
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.setEncoding('utf8');
      request.on('end', mustCall(() => {
        client.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    response.end('test\uD83D\uDE00', mustCall(() => {
      server.close();
    }));
  }));
  server.listen(0, mustCall(() => {
    let data = '';
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.setEncoding('utf8');
      request.on('data', (chunk) => (data += chunk));
      request.on('end', mustCall(() => {
        strictEqual(data, 'test\uD83D\uDE00');
        client.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    response.end(mustCall(() => {
      server.close();
    }));
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'GET',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => client.close()));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    strictEqual(response.writableEnded, false);
    strictEqual(response.finished, false);
    response.writeHead(HTTP_STATUS_OK, { foo: 'bar' });
    strictEqual(response.finished, false);
    response.end('data', mustCall());
    strictEqual(response.writableEnded, true);
    strictEqual(response.finished, true);
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('response', mustCall((headers, flags) => {
        strictEqual(headers[HTTP2_HEADER_STATUS], HTTP_STATUS_OK);
        strictEqual(headers.foo, 'bar');
      }));
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    request.on('end', mustCall());
    response.end();
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    response.writeHead(HTTP_STATUS_OK, { foo: 'bar' });
    response.stream.on('close', mustCall(() => {
      response.end(mustCall());
    }));
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('response', mustCall((headers, flags) => {
        strictEqual(headers[HTTP2_HEADER_STATUS], HTTP_STATUS_OK);
        strictEqual(headers.foo, 'bar');
      }));
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    setTimeout(mustCall(() => {
      response.writeHead(HTTP_STATUS_OK, { foo: 'bar' });
      response.end('data', mustCall());
    }), platformTimeout(10));
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('response', mustCall((headers, flags) => {
        strictEqual(headers[HTTP2_HEADER_STATUS], HTTP_STATUS_OK);
        strictEqual(headers.foo, 'bar');
      }));
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    let finished = false;
    response.writeHead(HTTP_STATUS_OK, { foo: 'bar' });
    response.on('finish', mustCall(() => {
      finished = false;
    }));
    response.end('data', mustCall(() => {
      strictEqual(finished, false);
      response.end('data', mustCall());
    }));
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('response', mustCall((headers, flags) => {
        strictEqual(headers[HTTP2_HEADER_STATUS], HTTP_STATUS_OK);
        strictEqual(headers.foo, 'bar');
      }));
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
{
  const server = createServer(mustCall((request, response) => {
    response.end('data', mustCall());
    response.end(mustCall());
  }));
  server.listen(0, mustCall(() => {
    const { port } = server.address();
    const client = connect(url, mustCall(() => {
      const headers = {
        ':method': 'HEAD',
        ':scheme': 'http',
        ':authority': `localhost:${port}`
      };
      const request = client.request(headers);
      request.on('response', mustCall((headers, flags) => {
        strictEqual(headers[HTTP2_HEADER_STATUS], HTTP_STATUS_OK);
      }));
      request.on('data', mustNotCall());
      request.on('end', mustCall(() => {
        client.close();
        server.close();
      }));
      request.end();
      request.resume();
    }));
  }));
}
