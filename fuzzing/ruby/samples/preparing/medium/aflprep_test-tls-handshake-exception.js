'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (process.argv[2] === 'child') {
  const https = require('https');
  const net = require('net');
  const tls = require('tls');
  const { Duplex } = require('stream');
  const { mustCall } = common;
  const cert = fixtures.readKey('rsa_cert.crt');
  const key = fixtures.readKey('rsa_private.pem');
  net.createServer(mustCall(onplaintext)).listen(0, mustCall(onlisten));
  function onlisten() {
    const { port } = this.address();
    https.get({ port, rejectUnauthorized: false });
  }
  function onplaintext(c) {
    const d = new class extends Duplex {
      _read(n) {
        const data = c.read(n);
        if (data) d.push(data);
      }
      _write(...xs) {
        c.write(...xs);
      }
    }();
    c.on('data', d.push.bind(d));
    const options = { key, cert };
    const fail = () => { throw new Error('eyecatcher'); };
    tls.createServer(options, mustCall(fail)).emit('connection', d);
  }
} else {
  const assert = require('assert');
  const { spawnSync } = require('child_process');
  const result = spawnSync(process.execPath, [__filename, 'child']);
  const stderr = result.stderr.toString();
  const ok = stderr.includes('Error: eyecatcher');
  assert(ok, stderr);
}
