async_test(function() {
  var data = "TEST";
  var reader = new FileReader();
  reader.onload = this.step_func_done(function() {
    assert_equals(reader.result, data);
  });
  reader.onerror = this.unreached_func("Unexpected error event");
  reader.readAsText(blob);
}, "Create Blob in Worker");
done();
