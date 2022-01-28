function checkEntries(perfEntriesToCheck, expectedEntries) {
  function findMatch(pe) {
    for (var i = expectedEntries.length - 1; i >= 0; i--) {
      var ex = expectedEntries[i];
      if (ex.entryType === pe.entryType && ex.name === pe.name) {
        return ex;
      }
    }
    return null;
  }
  assert_equals(perfEntriesToCheck.length, expectedEntries.length, "performance entries must match");
  perfEntriesToCheck.forEach(function (pe1) {
    assert_not_equals(findMatch(pe1), null, "Entry matches");
  });
}
function wait() {
  var now = performance.now();
  while (now === performance.now())
    continue;
}
function checkSorted(entries) {
  assert_not_equals(entries.length, 0, "entries list must not be empty");
  if (!entries.length)
    return;
  var sorted = false;
  var lastStartTime = entries[0].startTime;
  for (var i = 1; i < entries.length; ++i) {
    var currStartTime = entries[i].startTime;
    assert_less_than_equal(lastStartTime, currStartTime, "entry list must be sorted by startTime");
    lastStartTime = currStartTime;
  }
}
