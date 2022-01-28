'use strict';
if (!common.hasIntl) {
  common.skip('missing Intl');
}
const { test, assert_equals, assert_true, assert_throws } =
const request = {
  response: require(
    fixtures.path('wpt', 'url', 'resources', 'urltestdata.json')
  )
};
function runURLConstructorTests() {
         runURLTests(request.response)
}
function bURL(url, base) {
  return new URL(url, base || "about:blank")
}
function runURLTests(urltests) {
  for(var i = 0, l = urltests.length; i < l; i++) {
    var expected = urltests[i]
    test(function() {
      if (expected.failure) {
        assert_throws(new TypeError(), function() {
          bURL(expected.input, expected.base)
        })
        return
      }
      var url = bURL(expected.input, expected.base)
      assert_equals(url.href, expected.href, "href")
      assert_equals(url.protocol, expected.protocol, "protocol")
      assert_equals(url.username, expected.username, "username")
      assert_equals(url.password, expected.password, "password")
      assert_equals(url.host, expected.host, "host")
      assert_equals(url.hostname, expected.hostname, "hostname")
      assert_equals(url.port, expected.port, "port")
      assert_equals(url.pathname, expected.pathname, "pathname")
      assert_equals(url.search, expected.search, "search")
      if ("searchParams" in expected) {
        assert_true("searchParams" in url)
        assert_equals(url.searchParams.toString(), expected.searchParams, "searchParams")
      }
      assert_equals(url.hash, expected.hash, "hash")
    }, "Parsing: <" + expected.input + "> against <" + expected.base + ">")
  }
}
function runURLSearchParamTests() {
  test(function() {
    assert_true("searchParams" in url)
    var searchParams = url.searchParams
    assert_true(url.searchParams === searchParams, 'Object identity should hold.')
  }, 'URL.searchParams getter')
  test(function() {
    assert_true("searchParams" in url)
    var searchParams = url.searchParams
    assert_equals(searchParams.toString(), 'a=b')
    searchParams.set('a', 'b')
    assert_equals(url.searchParams.toString(), 'a=b')
    assert_equals(url.search, '?a=b')
    url.search = ''
    assert_equals(url.searchParams.toString(), '')
    assert_equals(url.search, '')
    assert_equals(searchParams.toString(), '')
  }, 'URL.searchParams updating, clearing')
  test(function() {
    'use strict'
    var url = bURL(urlString)
    assert_throws(TypeError(), function() { url.searchParams = new URLSearchParams(urlString) })
  }, 'URL.searchParams setter, invalid values')
  test(function() {
    assert_true("searchParams" in url)
    var searchParams = url.searchParams
    assert_equals(url.search, '?a=b&c=d')
    assert_equals(searchParams.toString(), 'a=b&c=d')
    url.search = 'e=f&g=h'
    assert_equals(url.search, '?e=f&g=h')
    assert_equals(searchParams.toString(), 'e=f&g=h')
    url.search = '?e=f&g=h'
    assert_equals(url.search, '?e=f&g=h')
    assert_equals(searchParams.toString(), 'e=f&g=h')
    searchParams.append('i', ' j ')
    assert_equals(url.search, '?e=f&g=h&i=+j+')
    assert_equals(url.searchParams.toString(), 'e=f&g=h&i=+j+')
    assert_equals(searchParams.get('i'), ' j ')
    searchParams.set('e', 'updated')
    assert_equals(url.search, '?e=updated&g=h&i=+j+')
    assert_equals(searchParams.get('e'), 'updated')
    assert_equals(url2.search, '??a=b&c=d')
    assert_equals(url2.searchParams.toString(), '%3Fa=b&c=d')
    assert_equals(url2.search, '??a=b')
    assert_equals(url2.searchParams.toString(), '%3Fa=b')
  }, 'URL.searchParams and URL.search setters, update propagation')
}
runURLSearchParamTests()
runURLConstructorTests()
