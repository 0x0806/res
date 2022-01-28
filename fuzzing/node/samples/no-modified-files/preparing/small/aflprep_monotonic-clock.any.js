test(function() {
  assert_true(self.performance.now() > 0, "self.performance.now() returns positive numbers");
}, "self.performance.now() returns a positive number");
test(function() {
    var now1 = self.performance.now();
    var now2 = self.performance.now();
    assert_true((now2-now1) >= 0, "self.performance.now() difference is not negative");
  },
  "self.performance.now() difference is not negative"
);
