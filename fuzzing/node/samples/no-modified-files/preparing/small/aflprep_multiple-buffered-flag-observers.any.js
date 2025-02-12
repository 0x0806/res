promise_test(() => {
  const promise1 = new Promise(resolve1 => {
    let numObserved1 = 0;
    new PerformanceObserver((entryList, obs) => {
      new PerformanceObserver(list => {
        numObserved1 += list.getEntries().length;
        if (numObserved1 == 3)
          resolve1();
      }).observe({type: 'mark', buffered: true});
      obs.disconnect();
    }).observe({entryTypes: ['mark']});
    performance.mark('foo');
  });
  const promise2 = new Promise(resolve2 => {
    step_timeout(() => {
      let numObserved2 = 0;
      new PerformanceObserver(list => {
        numObserved2 += list.getEntries().length;
        if (numObserved2 == 3)
          resolve2();
      }).observe({type: 'mark', buffered: true});
    }, 100);
    performance.mark('bar');
  });
  performance.mark('meow');
  return Promise.all([promise1, promise2]);
}, 'Multiple PerformanceObservers with buffered flag see all entries');
