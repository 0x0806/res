var performanceNamespace = window.performance;
var namespace_check = false;
function wp_test(func, msg, properties)
{
  if (!namespace_check)
  {
    namespace_check = true;
    if (performanceNamespace === undefined || performanceNamespace == null)
    {
      test(function() { assert_true(performanceNamespace !== undefined && performanceNamespace != null, "window.performance is defined and not null"); }, "window.performance is defined and not null.");
    }
  }
  test(func, msg, properties);
}
function test_true(value, msg, properties)
{
  wp_test(function () { assert_true(value, msg); }, msg, properties);
}
function test_equals(value, equals, msg, properties)
{
  wp_test(function () { assert_equals(value, equals, msg); }, msg, properties);
}
function test_entries(actualEntries, expectedEntries) {
  test_equals(actualEntries.length, expectedEntries.length)
  expectedEntries.forEach(function (expectedEntry) {
    var foundEntry = actualEntries.find(function (actualEntry) {
      return typeof Object.keys(expectedEntry).find(function (key) {
            return actualEntry[key] !== expectedEntry[key]
          }) === 'undefined'
    })
    test_true(!!foundEntry, `Entry ${JSON.stringify(expectedEntry)} could not be found.`)
    if (foundEntry) {
      assert_object_equals(foundEntry.toJSON(), expectedEntry)
    }
  })
}
function delayedLoadListener(callback) {
  window.addEventListener('load', function() {
    step_timeout(callback, 0)
  })
}
