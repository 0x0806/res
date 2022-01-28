test(function()
{
    self.performance.mark("mark1");
    self.performance.measure("measure1", "mark1");
    self.performance.mark("mark2");
    self.performance.measure("measure2", "mark2");
    var entries = self.performance.getEntriesByType("measure");
    assert_equals(entries.length, 2, "Two measures have been created for this test.");
    self.performance.clearMeasures("measure1");
    entries = self.performance.getEntriesByName("measure1");
    assert_equals(entries.length, 0,
              "After a call to self.performance.clearMeasures(\"measure1\"), " +
              "self.performance.getEntriesByName(\"measure1\") returns an empty object.");
    entries = self.performance.getEntriesByName("measure2");
    assert_equals(entries[0].name, "measure2",
              "After a call to self.performance.clearMeasures(\"measure1\"), " +
              "self.performance.getEntriesByName(\"measure2\") returns an object containing the " +
              "\"measure2\" measure.");
}, "Clearing an existent measure doesn't affect other existing measures");
