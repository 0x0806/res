'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (common.hasOpenSSL3)
  common.skip('when using OpenSSL 3.x');
const pem = `
-----BEGIN RSA PRIVATE KEY-----
4CrAO2IPV6JER9Niwl3ktzNjOMAUQG6BCRSqRQIDAQABAoIBAAmB0+cOsG5ZRYvT
Gp6FZVPSgz10MZdLSPLhXqZkY4IxIvNltjBDqkmivd12CD+GVr0qUmTJHzTpk+kG
WFJJuUe6KFetPaDm6NgZgpOmawyUwd5czDjJ6wWgsRywiTISInfJlgWLBVMOuba7
iBL9Xuy0hmcbj0ByoRW9l3gCiBX3yJw3I6wqXTcCgYBnjei22eRF15iIeTHvQfq+
zwc9BqeMHqW3rqWwT1Z0smbQODOD5tB6qEKMWaSN+Y6o2qC65kWjAXpclI110PME
mkBgtiXQyqpg+sfNOkfPIvAVZEsMYax0+0SNKrWbMsGLRjFchmMUovQ+zccQ4NT2
4b2op8Rlbxk8R9ahK1s5u7Bu47YMjZSjJwBQn4OobVX3SI994njJ2a9JX4j0pQWK
h2LHnKQZ1qWHn+BXWo5d7hBRwWVaK66g3GDN0blZpSz1kKcpy1Pl
-----END RSA PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
MIICwjCCAaqgAwIBAgIDAQABMA0GCSqGSIb3DQEBDQUAMBUxEzARBgNVBAMWCmxv
Y2FsLmhvc3QwHhcNMTkxMjA1MDQyODMzWhcNNDQxMTI5MDQyODMzWjAVMRMwEQYD
VQQDFgpsb2NhbC5ob3N0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
YxR7XudJZJ5lk3PkG8ZgrhuenPYP80UJYVzAC2YZ9KYe3r2BrVbut1j+8h0TwVcx
wl3ktzNjOMAUQG6BCRSqRQIDAQABoxswGTAXBgNVHREEEDAOlwwqLmxvY2FsLmhv
c3QwDQYJKoZIhvcNAQENBQADggEBAH5ThRLDLwOGuhKsifyiq7k8gbx1FqRegO7H
SIiIYYB35v5Pk0ZPN8QBJwNQzJEjUMjCpHXNdBxknBXRaA8vkbnryMfJm37gPTwA
f79uOowv3lLTzQ9na5EThA0tp8d837hdYrrIHh5cfTqBDxG0Tu8=
-----END CERTIFICATE-----
`;
const tls = require('tls');
const options = {
  key: pem,
  cert: pem,
};
const server = tls.createServer(options, (socket) => {
  socket.end();
});
server.listen(0, common.mustCall(function() {
  const client = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(() => {
    client.getPeerCertificate();
    server.close();
    client.end();
  }));
}));
