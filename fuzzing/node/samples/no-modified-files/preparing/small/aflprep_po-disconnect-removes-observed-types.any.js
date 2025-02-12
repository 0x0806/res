async_test(function (t) {
  const observer  = new PerformanceObserver(
      t.step_func(function (entryList) {
        checkEntries(entryList.getEntries(),
          [{ entryType: "measure", name: "b"}]);
        t.done();
      })
    );
  observer.observe({type: "mark"});
  observer.disconnect();
  observer.observe({type: "measure"});
  performance.mark("a");
  performance.measure("b");
}, "Types observed are forgotten when disconnect() is called.");
