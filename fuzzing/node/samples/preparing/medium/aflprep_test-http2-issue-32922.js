'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const net = require('net');
const {
  HTTP2_HEADER_PATH,
} = http2.constants;
function normalSession(cb) {
    let error = null;
    req.on('error', (err) => {
      error = err;
    });
    req.on('response', (_headers) => {
      req.on('data', (_chunk) => { });
      req.on('end', () => {
        clientSession.close();
        return cb(error);
      });
    });
  });
}
normalSession(common.mustSucceed());
function socketNotFinished(done) {
  const socket2 = net.connect(443, 'google.com');
    let error = null;
    req.on('error', (err) => {
      error = err;
    });
    req.on('response', (_headers) => {
      req.on('data', (_chunk) => { });
      req.on('end', () => {
        clientSession.close();
        socket2.destroy();
        return done(error);
      });
    });
  });
}
socketNotFinished(common.mustSucceed());
function socketFinished(done) {
  const socket = net.connect(443, 'google.com', () => {
      let error = null;
      req.on('error', (err) => {
        error = err;
      });
      req.on('response', (_headers) => {
        req.on('data', (_chunk) => { });
        req.on('end', () => {
          clientSession.close();
          return done(error);
        });
      });
    });
  });
}
socketFinished(common.mustSucceed());
