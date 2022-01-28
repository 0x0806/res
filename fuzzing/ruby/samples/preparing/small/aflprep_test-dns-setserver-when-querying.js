'use strict';
const assert = require('assert');
const dns = require('dns');
const localhost = [ '127.0.0.1' ];
{
  {
    const resolver = new dns.Resolver();
    resolver.resolve('localhost', common.mustCall());
    assert.throws(resolver.setServers.bind(resolver, localhost), {
      code: 'ERR_DNS_SET_SERVERS_FAILED',
    });
  }
  {
    dns.resolve('localhost', common.mustCall());
    dns.setServers(localhost);
  }
}
