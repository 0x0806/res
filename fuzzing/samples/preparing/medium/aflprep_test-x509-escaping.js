'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { X509Certificate } = require('crypto');
const tls = require('tls');
const { hasOpenSSL3 } = common;
{
  const numLeaves = 5;
  for (let i = 0; i < numLeaves; i++) {
    const leafPEM = fixtures.readSync(name, 'utf8');
    const server = tls.createServer({
      key: keyPEM,
      cert: leafPEM + intermPEM,
    }, common.mustNotCall()).listen(common.mustCall(() => {
      const { port } = server.address();
      const socket = tls.connect(port, {
        ca: rootPEM,
        servername: 'nodejs.org',
      }, common.mustNotCall());
      socket.on('error', common.mustCall());
    })).unref();
  }
}
{
  const expectedSANs = [
    'DNS:"good.example.com\\u002c DNS:evil.example.com"',
    'DNS:"ex\\u00e4mple.com"',
    'DNS:"\\"evil.example.com\\""',
    'IP Address:8.8.8.8',
    'IP Address:8.8.4.4',
    hasOpenSSL3 ? 'IP Address:<invalid length=5>' : 'IP Address:<invalid>',
    hasOpenSSL3 ? 'IP Address:<invalid length=6>' : 'IP Address:<invalid>',
    'IP Address:A0B:C0D:E0F:0:0:0:7A7B:7C7D',
    'email:foo@example.com',
    'email:"foo@example.com\\u002c DNS:good.example.com"',
      'evil.example.com"',
      'evil.example.com"',
    hasOpenSSL3 ?
    'Registered ID:sha256WithRSAEncryption',
    'Registered ID:1.3.9999.12.34',
    hasOpenSSL3 ?
      'othername: XmppAddr::abc123' :
      'othername:<unsupported>',
    hasOpenSSL3 ?
      'othername:" XmppAddr::abc123\\u002c DNS:good.example.com"' :
      'othername:<unsupported>',
    hasOpenSSL3 ?
      'othername:" XmppAddr::good.example.com\\u0000abc123"' :
      'othername:<unsupported>',
    'othername:<unsupported>',
    hasOpenSSL3 ? 'othername: SRVName::abc123' : 'othername:<unsupported>',
    'othername:<unsupported>',
    hasOpenSSL3 ?
      'othername:" SRVName::abc\\u0000def"' :
      'othername:<unsupported>',
  ];
  for (let i = 0; i < expectedSANs.length; i++) {
    const cert = new X509Certificate(pem);
    assert.strictEqual(cert.subjectAltName, expectedSANs[i]);
    const server = tls.createServer({
      key: serverKey,
      cert: pem,
    }, common.mustCall((conn) => {
      conn.destroy();
      server.close();
    })).listen(common.mustCall(() => {
      const { port } = server.address();
      tls.connect(port, {
        ca: pem,
        servername: 'example.com',
        checkServerIdentity: (hostname, peerCert) => {
          assert.strictEqual(hostname, 'example.com');
          assert.strictEqual(peerCert.subjectaltname, expectedSANs[i]);
        },
      }, common.mustCall());
    }));
  }
}
{
  const expectedInfoAccess = [
    {
      legacy: {
        'OCSP - URI': [
        ],
      },
    },
    {
            'OCSP - DNS:"good.example.com\\u000a' +
      legacy: {
        'CA Issuers - URI': [
        ],
        'OCSP - DNS': [
        ],
      },
    },
    {
      legacy: {
        '1.3.9999.12.34 - URI': [
        ],
      },
    },
    hasOpenSSL3 ? {
      text: 'OCSP - othername: XmppAddr::good.example.com\n' +
            'OCSP - othername:<unsupported>\n' +
            'OCSP - othername: SRVName::abc123',
      legacy: {
        'OCSP - othername': [
          ' XmppAddr::good.example.com',
          '<unsupported>',
          ' SRVName::abc123',
        ],
      },
    } : {
      text: 'OCSP - othername:<unsupported>\n' +
            'OCSP - othername:<unsupported>\n' +
            'OCSP - othername:<unsupported>',
      legacy: {
        'OCSP - othername': [
          '<unsupported>',
          '<unsupported>',
          '<unsupported>',
        ],
      },
    },
    hasOpenSSL3 ? {
      text: 'OCSP - othername:" XmppAddr::good.example.com\\u0000abc123"',
      legacy: {
        'OCSP - othername': [
          ' XmppAddr::good.example.com\0abc123',
        ],
      },
    } : {
      text: 'OCSP - othername:<unsupported>',
      legacy: {
        'OCSP - othername': [
          '<unsupported>',
        ],
      },
    },
  ];
  for (let i = 0; i < expectedInfoAccess.length; i++) {
    const expected = expectedInfoAccess[i];
    const cert = new X509Certificate(pem);
    assert.strictEqual(cert.infoAccess,
                       `${expected.text}${hasOpenSSL3 ? '' : '\n'}`);
    const server = tls.createServer({
      key: serverKey,
      cert: pem,
    }, common.mustCall((conn) => {
      conn.destroy();
      server.close();
    })).listen(common.mustCall(() => {
      const { port } = server.address();
      tls.connect(port, {
        ca: pem,
        servername: 'example.com',
        checkServerIdentity: (hostname, peerCert) => {
          assert.strictEqual(hostname, 'example.com');
          assert.deepStrictEqual(peerCert.infoAccess,
                                 Object.assign(Object.create(null),
                                               expected.legacy));
        },
      }, common.mustCall());
    }));
  }
}
{
  const expectedSubjects = [
    {
      text: 'L=Somewhere\nCN=evil.example.com',
      legacy: {
        L: 'Somewhere',
        CN: 'evil.example.com',
      },
    },
    {
      text: 'L=Somewhere\\00evil.example.com',
      legacy: {
        L: 'Somewhere\0evil.example.com',
      },
    },
    {
      text: 'L=Somewhere\\0ACN=evil.example.com',
      legacy: {
        L: 'Somewhere\nCN=evil.example.com'
      },
    },
    {
      text: 'L=Somewhere\\, CN = evil.example.com',
      legacy: {
        L: 'Somewhere, CN = evil.example.com'
      },
    },
    {
      legacy: {
      },
    },
    {
      text: 'L=München\\\\\\0ACN=evil.example.com',
      legacy: {
        L: 'München\\\nCN=evil.example.com'
      }
    },
    {
      text: 'L=Somewhere + CN=evil.example.com',
      legacy: {
        L: 'Somewhere',
        CN: 'evil.example.com',
      }
    },
    {
      text: 'L=Somewhere \\+ CN=evil.example.com',
      legacy: {
        L: 'Somewhere + CN=evil.example.com'
      }
    },
    {
      text: 'L=L1 + L=L2\nL=L3',
      legacy: {
        L: ['L1', 'L2', 'L3']
      },
    },
    {
      text: 'L=L1\nL=L2\nL=L3',
      legacy: {
        L: ['L1', 'L2', 'L3']
      },
    },
  ];
  for (let i = 0; i < expectedSubjects.length; i++) {
    const expected = expectedSubjects[i];
    const cert = new X509Certificate(pem);
    assert.strictEqual(cert.subject, expected.text);
    assert.strictEqual(cert.issuer, expected.text);
    const server = tls.createServer({
      key: serverKey,
      cert: pem,
    }, common.mustCall((conn) => {
      conn.destroy();
      server.close();
    })).listen(common.mustCall(() => {
      const { port } = server.address();
      tls.connect(port, {
        ca: pem,
        servername: 'example.com',
        checkServerIdentity: (hostname, peerCert) => {
          assert.strictEqual(hostname, 'example.com');
          const expectedObject = Object.assign(Object.create(null),
                                               expected.legacy);
          assert.deepStrictEqual(peerCert.subject, expectedObject);
          assert.deepStrictEqual(peerCert.issuer, expectedObject);
        },
      }, common.mustCall());
    }));
  }
}
{
  const invalidJSON = [
    '"\\a invalid escape"',
    '"\\v invalid escape"',
    '"\\\' invalid escape"',
    '"\\x42 invalid escape"',
    '"\\u202 invalid escape"',
    '"\\012 invalid escape"',
    '"Unterminated string',
    '"Unterminated string\\"',
    '"Unterminated string\\\\\\"',
    '"\u0000 control character"',
    '"\u001e control character"',
    '"\u001f control character"',
  ];
  for (const invalidStringLiteral of invalidJSON) {
    assert.throws(() => {
      tls.checkServerIdentity('example.com', {
        subjectaltname: `DNS:${invalidStringLiteral}`,
      });
    }, {
      code: 'ERR_TLS_CERT_ALTNAME_FORMAT',
      message: 'Invalid subject alternative name string'
    });
  }
}
{
  const san = 'DNS:"a.example.com, DNS:b.example.com, DNS:c.example.com"';
  const hostname = 'b.example.com';
  assert.strictEqual(san.split(', ')[1], `DNS:${hostname}`);
  const err = tls.checkServerIdentity(hostname, { subjectaltname: san });
  assert(err);
  assert.strictEqual(err.code, 'ERR_TLS_CERT_ALTNAME_INVALID');
                                  'altnames: Host: b.example.com. is not in ' +
                                  'the cert\'s altnames: DNS:"a.example.com, ' +
                                  'DNS:b.example.com, DNS:c.example.com"');
}
{
  const key = fixtures.readKey('incorrect_san_correct_subject-key.pem');
  const cert = fixtures.readKey('incorrect_san_correct_subject-cert.pem');
  const servername = 'good.example.com';
  const certX509 = new X509Certificate(cert);
  assert.strictEqual(certX509.subject, `CN=${servername}`);
  assert.strictEqual(certX509.subjectAltName, 'DNS:evil.example.com');
  const server = tls.createServer({ key, cert }, common.mustNotCall());
  server.listen(common.mustCall(() => {
    const { port } = server.address();
    const socket = tls.connect(port, {
      ca: cert,
      servername,
    }, common.mustNotCall());
    socket.on('error', common.mustCall((err) => {
      assert.strictEqual(err.code, 'ERR_TLS_CERT_ALTNAME_INVALID');
                                      "certificate's altnames: Host: " +
                                      "good.example.com. is not in the cert's" +
                                      ' altnames: DNS:evil.example.com');
    }));
  })).unref();
}
{
  const key = fixtures.readKey('irrelevant_san_correct_subject-key.pem');
  const cert = fixtures.readKey('irrelevant_san_correct_subject-cert.pem');
  const servername = 'good.example.com';
  const certX509 = new X509Certificate(cert);
  assert.strictEqual(certX509.subject, `CN=${servername}`);
  assert.strictEqual(certX509.subjectAltName, 'IP Address:1.2.3.4');
  const server = tls.createServer({ key, cert }, common.mustCall((socket) => {
    socket.destroy();
    server.close();
  })).listen(common.mustCall(() => {
    const { port } = server.address();
    tls.connect(port, {
      ca: cert,
      servername,
    }, common.mustCall(() => {
    }));
  }));
}
