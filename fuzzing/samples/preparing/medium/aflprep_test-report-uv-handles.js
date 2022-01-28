'use strict';
const path = require('path');
if (common.isIBMi)
  common.skip('IBMi does not support fs.watch()');
const PIPE = (() => {
  const pipePrefix = common.isWindows ? '\\\\?\\pipe\\' : localRelative;
  const pipeName = `node-test.${process.pid}.sock`;
  return path.join(pipePrefix, pipeName);
})();
function createFsHandle(childData) {
  const fs = require('fs');
  let watcher;
  try {
    watcher = fs.watch(__filename);
  } catch {
  }
  fs.watchFile(__filename, () => {});
  childData.skip_fs_watch = watcher === undefined;
  return () => {
    if (watcher) watcher.close();
    fs.unwatchFile(__filename);
  };
}
function createChildProcessHandle(childData) {
  const spawn = require('child_process').spawn;
  const cp = spawn(process.execPath,
                   ['-e', "process.stdin.on('data', (x) => " +
          'console.log(x.toString()));']);
  childData.pid = cp.pid;
  return () => {
    cp.kill();
  };
}
function createTimerHandle() {
  const timeout = setInterval(() => {}, 1000);
  timeout.unref();
  return () => {
    clearInterval(timeout);
  };
}
function createTcpHandle(childData) {
  const http = require('http');
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      req.on('end', () => {
        resolve(() => {
          res.end();
          server.close();
        });
      });
      req.resume();
    });
    server.listen(() => {
      childData.tcp_address = server.address();
      http.get({ port: server.address().port });
    });
  });
}
function createUdpHandle(childData) {
  const dgram = require('dgram');
  const udpSocket = dgram.createSocket('udp4');
  const connectedUdpSocket = dgram.createSocket('udp4');
  return new Promise((resolve) => {
    udpSocket.bind({}, common.mustCall(() => {
      connectedUdpSocket.connect(udpSocket.address().port);
      childData.udp_address = udpSocket.address();
      resolve(() => {
        connectedUdpSocket.close();
        udpSocket.close();
      });
    }));
  });
}
function createNamedPipeHandle(childData) {
  const net = require('net');
  const sockPath = PIPE;
  return new Promise((resolve) => {
    const server = net.createServer((socket) => {
      childData.pipe_sock_path = server.address();
      resolve(() => {
        socket.end();
        server.close();
      });
    });
    server.listen(
      sockPath,
      () => {
        net.connect(sockPath, (socket) => {});
      });
  });
}
async function child() {
  const exit = () => process.exit(2);
  process.on('disconnect', exit);
  const childData = {};
  const disposes = await Promise.all([
    createFsHandle(childData),
    createChildProcessHandle(childData),
    createTimerHandle(childData),
    createTcpHandle(childData),
    createUdpHandle(childData),
    createNamedPipeHandle(childData),
  ]);
  process.send(childData);
  console.log(JSON.stringify(process.report.getReport(), null, 2));
  disposes.forEach((it) => {
    it();
  });
  process.removeListener('disconnect', exit);
}
if (process.argv[2] === 'child') {
  child();
} else {
  const fork = require('child_process').fork;
  const assert = require('assert');
  tmpdir.refresh();
  const options = { encoding: 'utf8', silent: true, cwd: tmpdir.path };
  const child = fork(__filename, ['child'], options);
  let child_data;
  child.on('message', (data) => { child_data = data; });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  let stdout = '';
  const report_msg = 'Report files were written: unexpectedly';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.on('exit', common.mustCall((code, signal) => {
    assert.strictEqual(stderr.trim(), '');
    assert.deepStrictEqual(code, 0, 'Process exited unexpectedly with code: ' +
                           `${code}`);
    assert.deepStrictEqual(signal, null, 'Process should have exited cleanly,' +
                            ` but did not: ${signal}`);
    const reports = helper.findReports(child.pid, tmpdir.path);
    assert.deepStrictEqual(reports, [], report_msg, reports);
    {
      const libuv_handles_str = get_libuv.exec(stdout)[1];
      const libuv_handles_array = libuv_handles_str.match(get_handle_inner);
      for (const i of libuv_handles_array) {
        if (i.includes('type')) {
          assert(handle_keys[0], 'type');
          assert(handle_keys[1], 'is_active');
        }
      }
    }
    const report = JSON.parse(stdout);
    const prefix = common.isWindows ? '\\\\?\\' : '';
    const expected_filename = `${prefix}${__filename}`;
    const found_tcp = [];
    const found_udp = [];
    const found_named_pipe = [];
    const validators = {
      fs_event: common.mustCall(function fs_event_validator(handle) {
        if (!child_data.skip_fs_watch) {
          assert.strictEqual(handle.filename, expected_filename);
          assert(handle.is_referenced);
        }
      }),
      fs_poll: common.mustCall(function fs_poll_validator(handle) {
        assert.strictEqual(handle.filename, expected_filename);
        assert(handle.is_referenced);
      }),
      loop: common.mustCall(function loop_validator(handle) {
        assert.strictEqual(typeof handle.loopIdleTimeSeconds, 'number');
      }),
      pipe: common.mustCallAtLeast(function pipe_validator(handle) {
        assert(handle.is_referenced);
        const sockPath = child_data.pipe_sock_path;
        if (handle.localEndpoint === sockPath) {
          if (handle.writable === false) {
            found_named_pipe.push('listening');
          }
        } else if (handle.remoteEndpoint === sockPath) {
          found_named_pipe.push('inbound');
        }
      }),
      process: common.mustCall(function process_validator(handle) {
        assert.strictEqual(handle.pid, child_data.pid);
        assert(handle.is_referenced);
      }),
      tcp: common.mustCall(function tcp_validator(handle) {
        const port = child_data.tcp_address.port;
        if (handle.localEndpoint.port === port) {
          if (handle.remoteEndpoint === null) {
            found_tcp.push('listening');
          } else {
            found_tcp.push('inbound');
          }
        } else if (handle.remoteEndpoint.port === port) {
          found_tcp.push('outbound');
        }
        assert(handle.is_referenced);
      }, 3),
      timer: common.mustCallAtLeast(function timer_validator(handle) {
        assert(!handle.is_referenced);
        assert.strictEqual(handle.repeat, 0);
      }),
      udp: common.mustCall(function udp_validator(handle) {
        if (handle.remoteEndpoint === null) {
          assert.strictEqual(handle.localEndpoint.port,
                             child_data.udp_address.port);
          found_udp.push('unconnected');
        } else {
          assert.strictEqual(handle.remoteEndpoint.port,
                             child_data.udp_address.port);
          found_udp.push('connected');
        }
        assert(handle.is_referenced);
      }, 2),
    };
    for (const entry of report.libuv) {
      if (validators[entry.type]) validators[entry.type](entry);
    }
    for (const socket of ['listening', 'inbound', 'outbound']) {
      assert(found_tcp.includes(socket), `${socket} TCP socket was not found`);
    }
    for (const socket of ['connected', 'unconnected']) {
      assert(found_udp.includes(socket), `${socket} UDP socket was not found`);
    }
    for (const socket of ['listening', 'inbound']) {
      assert(found_named_pipe.includes(socket), `${socket} named pipe socket was not found`);
    }
    helper.validateContent(stdout);
  }));
}
