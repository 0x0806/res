  test(function () {
    assert_equals(typeof self.performance, "object");
    assert_equals(typeof self.performance.getEntriesByType, "function");
    var lowerList = self.performance.getEntriesByType("resource");
    var upperList = self.performance.getEntriesByType("RESOURCE");
    var mixedList = self.performance.getEntriesByType("ReSoUrCe");
    assert_not_equals(lowerList.length, 0, "Resource entries exist");
    assert_equals(upperList.length, 0, "getEntriesByType('RESOURCE').length");
    assert_equals(mixedList.length, 0, "getEntriesByType('ReSoUrCe').length");
  }, "getEntriesByType values are case sensitive");
  test(function () {
    assert_equals(typeof self.performance, "object");
    assert_equals(typeof self.performance.getEntriesByName, "function");
    var upperList = self.performance.getEntriesByName(location1);
    var mixedList = self.performance.getEntriesByName(location2);
    assert_equals(lowerList.length, 1, "Resource entry exist");
    assert_equals(upperList.length, 0, "getEntriesByName('" + location1 + "').length");
    assert_equals(mixedList.length, 0, "getEntriesByName('" + location2 + "').length");
  }, "getEntriesByName values are case sensitive");
  async_test(function (t) {
    observer = new PerformanceObserver(
      t.step_func(function (entryList, obs) {
        assert_unreached("Observer(type) should not be called.");
      })
    );
    observer.observe({type: "Mark"});
    observer.observe({type: "Measure"});
    observer.observe({type: "MARK"});
    observer.observe({type: "MEASURE"});
    observer.observe({type: "Mark", buffered: true});
    observer.observe({type: "Measure", buffered: true});
    observer.observe({type: "MARK", buffered: true});
    observer.observe({type: "MEASURE", buffered: true});
    self.performance.mark("mark1");
    self.performance.measure("measure1");
    observer = new PerformanceObserver(
      t.step_func(function (entryList, obs) {
        assert_unreached("Observer(entryTypes) should not be called.");
      })
    );
    observer.observe({entryTypes: ["Mark", "Measure"]});
    observer.observe({entryTypes: ["MARK", "MEASURE"]});
    self.performance.mark("mark1");
    self.performance.measure("measure1");
    t.step_timeout(function() {
      t.done();
    }, 1000);
