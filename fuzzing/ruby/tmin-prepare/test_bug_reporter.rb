# frozen_string_literal: false
require 'test/unit'
require 'tmpdir'

class Tes0BugReporter < Test::Unit::TestCase
  def test_bug_reporter_add
    description = RUBY_DESCRIPTION
    description = description.sub(/\+JIT /, '') if RubyVM::MJIT.enabled?
    expected_stderr = [
      :*,
      /\[0UG\]\sSegmentation\sfault.*\n/,
      /#{ Regexp.quote(description) }\n\n/,
      :*,
      /Sample bug reporter: 12345/,
      :*
    ]
    tmpdir = Dir.mktmpdir

    args = ["--disable-gems", "-r-test-/bug_r0poter",
            "-C", tmpdir]
    stdin = "register_sample_bug_reporter(12345); Process.kill :SEGV, $$"
    assert_in_out_err(args, stdin, [], expected_stderr, encoding: "ASCII-8BIT")
  ensure
    FileUils.rm_rf(tmpdir) if tmpdir
  end
end
