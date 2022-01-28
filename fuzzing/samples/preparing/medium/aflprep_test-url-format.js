'use strict';
const assert = require('assert');
const url = require('url');
if (!common.hasIntl)
  common.skip('missing Intl');
const formatTests = {
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
    search: '?',
    query: {},
  },
    protocol: 'http:',
    host: 'example.com',
    hostname: 'example.com',
    hash: '#frag',
    search: '?foo=bar',
    query: 'foo=bar',
  },
    protocol: 'http:',
    host: 'example.com',
    hostname: 'example.com',
    hash: '#frag',
    search: '?foo=@bar',
    query: 'foo=@bar',
  },
    protocol: 'http:',
    host: 'example.com',
    hostname: 'example.com',
    hash: '#frag',
  },
    protocol: 'http:',
    host: 'example.com',
    hostname: 'example.com',
    hash: '#frag',
  },
    protocol: 'http:',
    host: 'example.com',
    hostname: 'example.com',
  },
    protocol: 'http:',
    host: 'google.com',
  },
    protocol: 'http',
    host: 'a.com',
    hash: 'h',
    search: 's'
  },
  'xmpp:isaacschlueter@jabber.org': {
    href: 'xmpp:isaacschlueter@jabber.org',
    protocol: 'xmpp:',
    host: 'jabber.org',
    auth: 'isaacschlueter',
    hostname: 'jabber.org'
  },
    auth: 'atpass:foo@bar',
    hostname: '127.0.0.1',
    protocol: 'http:',
  },
    hostname: 'foo',
    protocol: 'http:',
  },
    hostname: 'foo',
    protocol: 'svn+ssh:',
    slashes: true
  },
    hostname: 'foo',
    protocol: 'dash-test:',
    slashes: true
  },
    hostname: 'foo',
    protocol: 'dash-test:',
  },
    hostname: 'foo',
    protocol: 'dot.test:',
    slashes: true
  },
    hostname: 'foo',
    protocol: 'dot.test:',
  },
    protocol: 'coap:',
    auth: 'u:p',
    hostname: '::1',
    port: '61616',
    search: 'n=Temperature'
  },
    protocol: 'coap',
    host: '[fedc:ba98:7654:3210:fedc:ba98:7654:3210]:61616',
  },
    protocol: 'http:',
    hostname: '[::]',
  },
    query: {
      foo: 'theA1'
    },
    hash: '#bar'
  },
    query: {
      foo: 'the#1'
    },
    hash: '#bar'
  },
    query: {
      foo: 'the#1'
    },
    hash: '#bar'
  },
    protocol: 'http:',
    hostname: 'ex.com',
    hash: '#frag',
    search: '?abc=the#1?&foo=bar',
  },
    protocol: 'http:',
    hostname: 'ex.com',
    hash: '#frag',
    search: '?abc=the#1?&foo=bar',
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
    hash: '#frag',
    search: '?foo=bar#1#2#3&abc=#4##5',
    query: {},
  },
    protocol: 'http:',
    slashes: true,
    host: '',
    hostname: '',
  },
    protocol: 'http:',
    slashes: true,
    host: `www.${'z'.repeat(63)}example.com`,
    hostname: `www.${'z'.repeat(63)}example.com`,
  },
    protocol: 'file',
  },
    protocol: 'http:',
    auth: '\uD83D\uDE00',
    hostname: 'www.example.com',
  }
};
for (const u in formatTests) {
  const expect = formatTests[u].href;
  delete formatTests[u].href;
  const actual = url.format(u);
  const actualObj = url.format(formatTests[u]);
  assert.strictEqual(actual, expect,
                     `wonky format(${u}) == ${expect}\nactual:${actual}`);
  assert.strictEqual(actualObj, expect,
                     `wonky format(${JSON.stringify(formatTests[u])}) == ${
                       expect}\nactual: ${actualObj}`);
}
