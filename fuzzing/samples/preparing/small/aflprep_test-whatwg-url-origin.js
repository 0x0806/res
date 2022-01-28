'use strict';
if (!common.hasIntl) {
  common.skip('missing Intl');
}
const request = {
  response: require(
    fixtures.path('wpt', 'url', 'resources', 'urltestdata.json')
  )
};
function runURLOriginTests() {
         runURLTests(request.response)
}
function bURL(url, base) {
  return new URL(url, base || "about:blank")
}
function runURLTests(urltests) {
  for(var i = 0, l = urltests.length; i < l; i++) {
    var expected = urltests[i]
    if (typeof expected === "string" || !("origin" in expected)) continue
    test(function() {
      var url = bURL(expected.input, expected.base)
      assert_equals(url.origin, expected.origin, "origin")
    }, "Origin parsing: <" + expected.input + "> against <" + expected.base + ">")
  }
}
runURLOriginTests()
